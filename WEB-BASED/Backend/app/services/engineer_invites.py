"""
Account invitation helpers.

Supports invite-link generation plus email delivery through either:
1. Resend API over HTTPS (works well on hosted environments)
2. SMTP when explicitly configured
3. Manual-link fallback when no provider is configured
"""

from __future__ import annotations

from dataclasses import dataclass
from email.message import EmailMessage
from hashlib import sha256
from html import escape
from secrets import token_urlsafe
import smtplib
from typing import Optional

import httpx

from app.config import settings


@dataclass
class InviteDeliveryResult:
    method: str
    message: str
    invite_url: Optional[str] = None


def generate_invite_token() -> str:
    return token_urlsafe(32)


def hash_invite_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def build_invite_url(token: str) -> str:
    base_url = settings.frontend_url.rstrip("/")
    return f"{base_url}/setup-account?token={token}"


def build_password_reset_url(token: str) -> str:
    base_url = settings.frontend_url.rstrip("/")
    return f"{base_url}/reset-password?token={token}"


def send_account_invitation_email(
    *,
    recipient_email: str,
    role_label: str,
    assignment_lines: list[str],
    invite_url: str,
) -> InviteDeliveryResult:
    subject = "Complete your HydraNet account setup"
    safe_assignments = "".join(f"<li>{escape(line)}</li>" for line in assignment_lines)
    safe_invite_url = escape(invite_url)
    html_body = f"""
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">Finish your HydraNet account setup</h2>
      <p>You have been invited to join HydraNet as a <strong>{role_label}</strong>.</p>
      <ul>{safe_assignments}</ul>
      <p>Use the secure link below to complete your profile, set your password, and activate your login:</p>
      <p style="margin: 20px 0;">
        <a href="{safe_invite_url}" style="display:inline-block;padding:12px 18px;background:#0ea5e9;color:#ffffff;text-decoration:none;border-radius:10px;">
          Complete Account Setup
        </a>
      </p>
      <p>If the button does not open, copy this link into your browser:</p>
      <p><a href="{safe_invite_url}">{safe_invite_url}</a></p>
      <p style="font-size: 13px; color: #64748b;">This invitation expires automatically for security.</p>
    </div>
    """
    text_body = (
        f"You have been invited to HydraNet as a {role_label}.\n"
        + ("\n".join(assignment_lines) + "\n\n" if assignment_lines else "\n")
        +
        f"Complete your account setup here:\n{invite_url}\n"
    )

    fallback_message: Optional[str] = None

    resend_result = _send_via_resend(
        recipient_email=recipient_email,
        subject=subject,
        html_body=html_body,
    )
    if resend_result and resend_result.method == "email":
        return resend_result
    if resend_result and resend_result.message:
        fallback_message = resend_result.message

    smtp_result = _send_via_smtp(
        recipient_email=recipient_email,
        subject=subject,
        text_body=text_body,
        html_body=html_body,
    )
    if smtp_result and smtp_result.method == "email":
        return smtp_result
    if smtp_result and smtp_result.message:
        fallback_message = smtp_result.message

    return InviteDeliveryResult(
        method="manual_link",
        message=fallback_message or "No outbound email provider is configured. Share the invite link manually.",
        invite_url=invite_url,
    )


def send_engineer_invitation_email(
    *,
    recipient_email: str,
    role: str,
    team_name: str,
    dma_name: str,
    invite_url: str,
) -> InviteDeliveryResult:
    role_label = "Team Leader" if role == "team_leader" else "Engineer"
    return send_account_invitation_email(
        recipient_email=recipient_email,
        role_label=role_label,
        assignment_lines=[f"DMA: {dma_name}", f"Team: {team_name}"],
        invite_url=invite_url,
    )


def send_password_reset_email(
    *,
    recipient_email: str,
    role_label: str,
    reset_url: str,
) -> InviteDeliveryResult:
    subject = "Reset your HydraNet password"
    safe_reset_url = escape(reset_url)
    html_body = f"""
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">Reset your HydraNet password</h2>
      <p>We received a password reset request for your <strong>{escape(role_label)}</strong> account.</p>
      <p>Use the secure link below to choose a new password:</p>
      <p style="margin: 20px 0;">
        <a href="{safe_reset_url}" style="display:inline-block;padding:12px 18px;background:#0ea5e9;color:#ffffff;text-decoration:none;border-radius:10px;">
          Reset Password
        </a>
      </p>
      <p>If the button does not open, copy this link into your browser:</p>
      <p><a href="{safe_reset_url}">{safe_reset_url}</a></p>
      <p style="font-size: 13px; color: #64748b;">If you did not request this, you can ignore this email. The link expires automatically.</p>
    </div>
    """
    text_body = (
        f"We received a password reset request for your HydraNet {role_label} account.\n\n"
        f"Reset your password here:\n{reset_url}\n\n"
        "If you did not request this, you can ignore this email.\n"
    )

    fallback_message: Optional[str] = None

    resend_result = _send_via_resend(
        recipient_email=recipient_email,
        subject=subject,
        html_body=html_body,
    )
    if resend_result and resend_result.method == "email":
        return resend_result
    if resend_result and resend_result.message:
        fallback_message = resend_result.message

    smtp_result = _send_via_smtp(
        recipient_email=recipient_email,
        subject=subject,
        text_body=text_body,
        html_body=html_body,
    )
    if smtp_result and smtp_result.method == "email":
        return smtp_result
    if smtp_result and smtp_result.message:
        fallback_message = smtp_result.message

    return InviteDeliveryResult(
        method="manual_link",
        message=fallback_message or "No outbound email provider is configured. Share the password reset link manually.",
        invite_url=reset_url,
    )


def _send_via_resend(*, recipient_email: str, subject: str, html_body: str) -> Optional[InviteDeliveryResult]:
    if not settings.resend_api_key or not settings.resend_from_email:
        return None

    payload = {
        "from": _format_sender(settings.resend_from_email, settings.resend_from_name),
        "to": [recipient_email],
        "subject": subject,
        "html": html_body,
    }

    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.resend_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=20.0,
        )
        response.raise_for_status()
        return InviteDeliveryResult(
            method="email",
            message="Invitation email sent successfully.",
        )
    except Exception as exc:
        return InviteDeliveryResult(
            method="manual_link",
            message=f"Email API delivery failed, so a manual invite link was generated instead: {exc}",
        )


def _send_via_smtp(
    *,
    recipient_email: str,
    subject: str,
    text_body: str,
    html_body: str,
) -> Optional[InviteDeliveryResult]:
    if not settings.smtp_host or not settings.smtp_from_email:
        return None

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = _format_sender(settings.smtp_from_email, settings.smtp_from_name)
    message["To"] = recipient_email
    message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            if settings.smtp_use_tls:
                server.starttls()
            if settings.smtp_username:
                server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)

        return InviteDeliveryResult(
            method="email",
            message="Invitation email sent successfully.",
        )
    except Exception as exc:
        return InviteDeliveryResult(
            method="manual_link",
            message=f"SMTP delivery failed, so a manual invite link was generated instead: {exc}",
        )


def _format_sender(email: str, name: str) -> str:
    clean_name = (name or "").strip()
    return f"{clean_name} <{email}>" if clean_name else email
