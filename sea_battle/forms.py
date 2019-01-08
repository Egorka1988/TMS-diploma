from django.forms import ModelForm
from .models import BattleMap
# form for keeping info about players and size of battlefield

class GameAttrForm(ModelForm):
    class Meta:
        model = BattleMap
        fields = ['map1_of_btlfld', 'map2_of_btlfld',]