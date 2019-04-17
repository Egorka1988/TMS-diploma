

from django import forms

from .models import BattleMap
# form for keeping info about players and battlemaps


class FleetForm(forms.Form):

    def clean(self):

        cleaned_data = super().clean()


    def clean_fleet(self):

        fleet = self.data["fleet"]

        print("cleaned_data:", fleet)




        return fleet



class StatementForm(forms.ModelForm):  # form for serving shoots' exchange

    class Meta:
        model = BattleMap
        fields = ('shoots',)  # tuple of fieldsnames, according to the model


