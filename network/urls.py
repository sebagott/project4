
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("allposts", views.all_posts, name="allposts"),
    path("following", views.following, name="following"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>", views.profile, name="profile"), #GET or POST
    # API paths
    path("post", views.api_create_post, name="api_create"), #GET or POST
    path("posts/following", views.api_following_posts, name="api_following"), #GET
    path("posts/all", views.api_all_posts, name="api_allposts"), #GET
    path("posts/<str:username>", views.api_all_user_posts, name="api_userposts"), #GET
    path("post/<int:post_id>", views.api_post, name="api_post"), #GET or PUT

]
