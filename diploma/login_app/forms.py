from django import forms
from .models import UserData

class loginform(forms.ModelForm):

    class Meta:
        model = UserData
        fields = ('user_name', 'text',)