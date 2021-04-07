from django.db import models
import re
class UserManager (models.Manager):
    def reg_validate(self, postdata):
        print("i am validating the data now")
        errors={}
        EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
        PASSWORD_REGEX=re.compile(r'^[a-zA-Z0-9.*%!@^&]')
        if len(postdata['first_name'])<2:
            errors['first_name']="First Name should be minimum atleast 2 characters"
        if len(postdata['last_name'])<2:
                errors['last_name']="Last Name should be minimum atleast 2 characters"
        if not EMAIL_REGEX.match(postdata['email']):
            errors['email']="Invalid Email Address"
        if len(postdata['password'])< 8:
            errors['password']="Password should be minimum 8 characters"
        if postdata['password']!=postdata['confirm_password']:
            errors['confirm_password']="Passwords should be identical"
        return errors
# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()

class Game(models.Model):
    player = models.ForeignKey(User, related_name='games_played', on_delete=models.CASCADE)
    score = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
