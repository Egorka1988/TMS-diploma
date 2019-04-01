

from django import forms

from .models import BattleMap
# form for keeping info about players and battlemaps


class GameAttrForm(forms.ModelForm):

    class Meta:

        model = BattleMap
        fields = ('map_of_bf',)  # tuple of fieldsnames, according to the model


class StatementForm(forms.ModelForm):  # form for serving shoots' exchange

    class Meta:
        model = BattleMap
        fields = ('shoots',)  # tuple of fieldsnames, according to the model


