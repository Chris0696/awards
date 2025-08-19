from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db.models import Sum
from project.models import Project, Vote
from userauths.models import User
import uuid

