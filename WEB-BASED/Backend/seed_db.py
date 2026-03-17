#!/usr/bin/env python
"""
Database Seeding Script
Populate database with initial data including admin user
Usage: python seed_db.py
"""

import sys
from datetime import datetime
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models import (
    User, Utility, UtilityManager, DMA, DMAManager, 
    Branch, Team, Engineer, EntityStatusEnum
)
from app.security.auth import hash_password

def seed_db():
    """Seed database with initial data"""
    db = SessionLocal()
    
    print("=" * 60)
    print("🌱 HydraNet Database Seeding")
    print("=" * 60)
    
    try:
        # Check if admin user already exists
        admin = db.query(User).filter(User.email == "admin@hydranet.com").first()
        if admin:
            print("\n⚠️  Admin user already exists. Skipping seed.")
            return True
        
        print("\n📝 Creating admin user...")
        
        # Create admin user
        admin_user = User(
            email="admin@hydranet.com",
            password=hash_password("admin123"),  # Change this!
            name="Admin User",
            phone="+1234567890",
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(admin_user)
        db.flush()  # Get the ID without committing
        
        print(f"✅ Created admin user: {admin_user.email}")
        
        print("\n📝 Creating test utility...")
        utility = Utility(
            name="City Water Department",
            description="Municipal water supply utility",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(utility)
        db.flush()
        
        print(f"✅ Created utility: {utility.name}")
        
        print("\n📝 Creating test utility manager...")
        utility_mgr = UtilityManager(
            utility_id=utility.id,
            email="manager@utility.com",
            password=hash_password("manager123"),
            name="John Manager",
            phone="+1111111111",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(utility_mgr)
        db.flush()
        
        print(f"✅ Created utility manager: {utility_mgr.name}")
        
        print("\n📝 Creating test DMA...")
        dma = DMA(
            utility_id=utility.id,
            name="Downtown DMA",
            description="Downtown water distribution area",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(dma)
        db.flush()
        
        print(f"✅ Created DMA: {dma.name}")
        
        print("\n📝 Creating test DMA manager...")
        dma_mgr = DMAManager(
            dma_id=dma.id,
            utility_id=utility.id,
            email="dma.manager@utility.com",
            password=hash_password("dmamanager123"),
            name="Jane DMA Manager",
            phone="+2222222222",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(dma_mgr)
        db.flush()
        
        print(f"✅ Created DMA manager: {dma_mgr.name}")
        
        print("\n📝 Creating test branch...")
        branch = Branch(
            utility_id=utility.id,
            dma_id=dma.id,
            name="Downtown Branch",
            description="Downtown service branch",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(branch)
        db.flush()
        
        print(f"✅ Created branch: {branch.name}")
        
        print("\n📝 Creating test team...")
        team = Team(
            branch_id=branch.id,
            dma_id=dma.id,
            name="Alpha Team",
            description="Field operations team",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(team)
        db.flush()
        
        print(f"✅ Created team: {team.name}")
        
        print("\n📝 Creating test engineer...")
        engineer = Engineer(
            branch_id=branch.id,
            dma_id=dma.id,
            team_id=team.id,
            name="Bob Engineer",
            email="engineer@utility.com",
            password=hash_password("engineer123"),
            phone="+3333333333",
            status=EntityStatusEnum.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(engineer)
        
        # Update team leader
        team.leader_id = engineer.id
        
        # Commit all changes
        db.commit()
        
        print(f"✅ Created engineer: {engineer.name}")
        
        print("\n" + "=" * 60)
        print("✅ Database seeding completed successfully!")
        print("\n📖 Test Credentials:")
        print("   Email: admin@hydranet.com")
        print("   Password: admin123")
        print("\n" + "=" * 60)
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = seed_db()
    sys.exit(0 if success else 1)
