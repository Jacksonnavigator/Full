"""
Image Upload Routes
API endpoints for image upload and retrieval
"""

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import ImageUpload, Report
from app.models.uploads import ImageTypeEnum
from app.security.dependencies import get_current_user, CurrentUser
from app.services.image_service import validate_image, compress_image_if_needed
import logging

logger = logging.getLogger(__name__)

uploads_router = APIRouter(prefix="/api/uploads", tags=["uploads"])


def _build_upload_response(image_upload: ImageUpload):
    return {
        "id": image_upload.id,
        "fileName": image_upload.file_name,
        "fileSize": image_upload.file_size,
        "width": image_upload.width,
        "height": image_upload.height,
        "mimeType": image_upload.mime_type,
        "imageType": image_upload.image_type,
        "createdAt": image_upload.created_at,
        "downloadUrl": f"/api/uploads/{image_upload.id}",
    }


@uploads_router.post("", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    report_id: str = Form(None),
    image_type: str = Form("report"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload an image file and store in PostgreSQL
    
    Args:
        file: Image file (JPEG, PNG, WebP)
        report_id: Associated report ID (optional)
        image_type: Type of image (report, submission_before, submission_after, profile)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Uploaded image metadata with download URL
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read file data
        file_data = await file.read()
        
        # Validate image
        try:
            width, height = validate_image(file_data, file.content_type)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image validation failed: {str(e)}"
            )
        
        # Compress if needed
        compressed_data, mime_type, final_width, final_height = compress_image_if_needed(
            file_data,
            file.content_type,
            max_width=1920,
            max_height=1920,
        )
        
        # Verify report exists if report_id provided
        if report_id:
            report = db.query(Report).filter(Report.id == report_id).first()
            if not report:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Report not found"
                )
        
        # Create image upload record
        image_upload = ImageUpload(
            file_data=compressed_data,
            file_name=file.filename,
            file_type=file.content_type,
            file_size=len(compressed_data),
            mime_type=mime_type,
            image_type=image_type,
            report_id=report_id,
            user_id=current_user.id if current_user.user_type == 'user' else None,
            engineer_id=current_user.id if current_user.user_type == 'engineer' else None,
            width=final_width,
            height=final_height,
        )
        
        db.add(image_upload)
        db.commit()
        db.refresh(image_upload)
        
        logger.info(f"✅ Image uploaded: {image_upload.id}, {len(compressed_data) / 1024:.1f}KB")
        
        return _build_upload_response(image_upload)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Image upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image upload failed"
        )


@uploads_router.post("/public", status_code=status.HTTP_201_CREATED)
async def upload_public_image(
    file: UploadFile = File(...),
    image_type: str = Form("report"),
    db: Session = Depends(get_db),
):
    """
    Anonymous/public image upload for the public reporting app.
    The report endpoint later links the upload to the created report.
    """
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )

        file_data = await file.read()

        try:
            width, height = validate_image(file_data, file.content_type)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image validation failed: {str(e)}"
            )

        compressed_data, mime_type, final_width, final_height = compress_image_if_needed(
            file_data,
            file.content_type,
            max_width=1920,
            max_height=1920,
        )

        image_upload = ImageUpload(
            file_data=compressed_data,
            file_name=file.filename,
            file_type=file.content_type,
            file_size=len(compressed_data),
            mime_type=mime_type,
            image_type=image_type,
            report_id=None,
            user_id=None,
            engineer_id=None,
            width=final_width,
            height=final_height,
        )

        db.add(image_upload)
        db.commit()
        db.refresh(image_upload)

        logger.info(f"✅ Public image uploaded: {image_upload.id}, {len(compressed_data) / 1024:.1f}KB")
        return _build_upload_response(image_upload)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Public image upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Public image upload failed"
        )


@uploads_router.get("/{image_id}")
async def download_image(
    image_id: str,
    db: Session = Depends(get_db),
):
    """
    Download/retrieve an image file
    
    Args:
        image_id: Image upload ID
        db: Database session
    
    Returns:
        Image file with proper content-type header
    """
    try:
        image = db.query(ImageUpload).filter(ImageUpload.id == image_id).first()
        
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        
        # Return image with proper headers
        return {
            "id": image.id,
            "fileName": image.file_name,
            "mimeType": image.mime_type,
            "data": image.file_data.hex(),  # Convert binary to hex string for JSON response
            "width": image.width,
            "height": image.height,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Image download error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image download failed"
        )


@uploads_router.delete("/{image_id}")
async def delete_image(
    image_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete an uploaded image (auth required)
    
    Args:
        image_id: Image upload ID
        current_user: Authenticated user
        db: Database session
    """
    try:
        image = db.query(ImageUpload).filter(ImageUpload.id == image_id).first()
        
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        
        # Check ownership/permissions
        if current_user.user_type == 'engineer' and image.engineer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this image"
            )
        
        db.delete(image)
        db.commit()
        
        logger.info(f"✅ Image deleted: {image_id}")
        
        return {"message": "Image deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Image deletion error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image deletion failed"
        )
