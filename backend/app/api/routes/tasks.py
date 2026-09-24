from math import ceil
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import (
    Project,
    Task,
    TaskPriority,
    TaskStatus,
    User,
)
from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskUpdate,
    PaginatedTaskResponse
)


router = APIRouter(
    tags=["Tasks"],
)


@router.post(
    "/projects/{project_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    project_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Make sure the project belongs to the logged-in user
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    task = Task(
        project_id=project_id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get(
    "/projects/{project_id}/tasks",
    response_model=PaginatedTaskResponse,
)
def get_tasks(
    project_id: int,
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    status_filter: TaskStatus | None = Query(
        default=None,
        alias="status",
    ),
    priority: TaskPriority | None = None,
    search: str | None = Query(
        default=None,
        min_length=1,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    query = db.query(Task).filter(
        Task.project_id == project_id
    )

    if status_filter is not None:
        query = query.filter(
            Task.status == status_filter
        )

    if priority is not None:
        query = query.filter(
            Task.priority == priority
        )

    if search:
        search_pattern = f"%{search}%"

        query = query.filter(
            Task.title.ilike(search_pattern)
            | Task.description.ilike(search_pattern)
        )

    total = query.count()

    pages = ceil(total / limit) if total > 0 else 0

    offset = (page - 1) * limit

    tasks = (
        query
        .order_by(Task.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "items": tasks,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
    }

@router.put(
    "/tasks/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = (
        db.query(Task)
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.user_id == current_user.id,
        )
        .first()
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    update_data = task_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = (
        db.query(Task)
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.user_id == current_user.id,
        )
        .first()
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    db.delete(task)
    db.commit()

    return None