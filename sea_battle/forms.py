from django import forms
from .models import BattleMap
# form for keeping info about players and size of battlefield
class GameAttrForm(forms.ModelForm):

    class Meta:
        model = BattleMap
        fields = ('field_size',)