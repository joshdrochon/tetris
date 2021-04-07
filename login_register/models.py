from django.db import models
class UserManager (models.Manager):
    def register(self, postdata):
        # pw = bcrypt.hashpw(postdata['password'].encode(), bcrypt.gensalt()).decode()
        return self.create(
            first_name = postdata['first_name'],
            last_name = postdata['last_name'],
            username = postdata['username'],
            email = postdata['email'],
            password = postdata['password'],
        )
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
