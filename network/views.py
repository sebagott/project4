from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseNotFound
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import json
from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def all_posts(request):
    return render(request, "network/posts.html", {
        "following": False
    })


def following(request):
    return render(request, "network/posts.html", {
        "following": True
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def profile(request, username):
    ''' GET request shows profile, PUT request toggles following status of request user on profile user '''
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return HttpResponseNotFound(f"<h1>User '{username}' does not exist</h1>")
    if request.method == 'GET':
        return render(request, "network/profile.html", {
                "profile_user": user
            })
    elif request.method == 'PUT':
        #data = json.loads(request.body)
        #follower = User.objects.get(username=data['follower_username'])
        follower = User.objects.get(pk=request.user.id)
        # Toggle following status
        if follower in user.followers.all():
            follower.following.remove(user)
            message = f"You stopped following '{user.username}'."
        else:
            follower.following.add(user)
            message = f"You are now following '{user.username}'."
        return JsonResponse({
            "message": message,
            "followers": user.followers.count(),
            "following": user.following.count()
        }, status=201)
    # Profile must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

# API calls
@login_required
def api_create_post(request):
    pass


@login_required
def api_post(request, post_id):
    pass

def api_all_posts(request):
    # Get all posts in reverse chronologial order
    posts = Post.objects.order_by("-timestamp").all()
    return JsonResponse([p.serialize() for p in posts], safe=False)

@login_required
def api_all_user_posts(request, username):
    # Get all user posts in reverse chronologial order
    try:
        user = User.objects.get(username=username)
        posts = Post.objects.order_by("-timestamp").filter(user=user)
        return JsonResponse([p.serialize() for p in posts], safe=False, status=201)
    except User.DoesNotExist:
        return JsonResponse({
            "error": "User does not exist"
        }, status=404)

@login_required
def api_following_posts(request):
    try:
        user = User.objects.get(pk=request.user.id)
        posts = Post.objects.order_by("-timestamp").filter(user__in=user.following.all())
        return JsonResponse([p.serialize() for p in posts], safe=False, status=201)
    except User.DoesNotExist:
        return JsonResponse({
            "error": "User does not exist"
        }, status=404)

