from django import forms
from django.core import serializers
from .models import BattleMap
# form for keeping info about players and size of battlefield

from django.contrib.postgres import validators

# форма не пашет. is_valid не проходит. Ошибок нет, но и данных в cleaned_data тоже
class GameAttrForm(forms.ModelForm):

    class Meta:
        model = BattleMap
        fields = ('map1_of_bf', 'user')  #поля формы, аналогичные полям модели

    def clean_map1_of_bf(self):
        _map1_of_bf = self.cleaned_data['json_form'] #пытаюсь отобрать данные по ключу в это поле
        return _map1_of_bf


    def clean(self): # cкопировал из BaseForm описания. Ни один мой кастомный метод не пашет
        self._validate_unique = False
        #self.cleaned_data= self.data
        return self.cleaned_data


# это, собственно, запрос:
# {'csrfmiddlewaretoken': ['7TBWLZ2YCrcTSYtZQZ8DdIKyPJN9lK1qo7DhVvuBgV735fpcexeR5i1uDzSdUQBB'],
# 'json_form': ['{"size":10,"opponent_username":"user1","0,0":"background-color: lime;","0,1":null,"0,2":null,"0,3":null,"0,4":null,'
#     '"0,5":null,"0,6":null,"0,7":null,"0,8":null,"0,9":null,"1,0":null,"1,1":null,"1,2":null,"1,3":null,"1,4":null,"1,5":null,"1,6":null,'
#     '"1,7":null,"1,8":null,"1,9":null,"2,0":null,"2,1":null,"2,2":null,"2,3":null,"2,4":null,"2,5":null,"2,6":null,"2,7":null,"2,8":null,'
#     '"2,9":null,"3,0":null,"3,1":null,"3,2":null,"3,3":null,"3,4":null,"3,5":null,"3,6":null,"3,7":null,"3,8":null,"3,9":null,"4,0":null,'
#     '"4,1":null,"4,2":null,"4,3":null,"4,4":null,"4,5":null,"4,6":null,"4,7":null,"4,8":null,"4,9":null,"5,0":null,"5,1":null,"5,2":null,'
#     '"5,3":null,"5,4":null,"5,5":null,"5,6":null,"5,7":null,"5,8":null,"5,9":null,"6,0":null,"6,1":null,"6,2":null,"6,3":null,"6,4":null,'
#     '"6,5":null,"6,6":null,"6,7":null,"6,8":null,"6,9":null,"7,0":null,"7,1":null,"7,2":null,"7,3":null,"7,4":null,"7,5":null,"7,6":null,'
#     '"7,7":null,"7,8":null,"7,9":null,"8,0":null,"8,1":null,"8,2":null,"8,3":null,"8,4":null,"8,5":null,"8,6":null,"8,7":null,"8,8":null,'
#     '"8,9":null,"9,0":null,"9,1":null,"9,2":null,"9,3":null,"9,4":null,"9,5":null,"9,6":null,"9,7":null,"9,8":null,"9,9":null}']}
