from django.contrib.auth.models import User
from django.contrib.postgres.fields import HStoreField
from django.db import models
#from django_registration.forms import User

class BattleMap(models.Model):

    map1_of_bf = HStoreField(default=dict)
    user = models.OneToOneField(User, unique=True, on_delete=models.CASCADE, verbose_name='player',null=True)

# In any case, for all your models that you need to be visible/editable only by the users that created them,
# you need to add a foreign key field named created_by with the user that created the object to that model,
# something like:  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True)
#механизм клиент-серверной репликации

# Сервер инициирует соединение
#
# В классической архитектуре "клиент-сервер" инициатором диалога всегда выступает клиент.
# Можно, однако, представить и другую ситуацию - диалог инициирует сервер, "проталкивая" информацию на клиента.
# Роль клиента в таком случае сводится к реакции (просмотру) на сообщения сервера. Типичным примером является
# работа "по подписке". Представим себе, что сервер получает какие-то события из внешнего источника. События
# имеют тип. Клиент, заинтересованный в получении события определенного типа, сообщает о своей заинтересованности
# серверу. Сервер, получив очередное событие, передает его всем заинтересованным в нем клиентам. Приведенный
# алгоритм является упрощенным описанием работы очень часто используемой службы событий (подобная служба есть
# практически во всех современных middleware ).

# Пассивная репликация
#
# В случае пассивной репликации [9, 5] каждая реплика хранит копию состояния объекта. Одна из реплик назначается
# первичной. Операции чтения выполняются локально во всех узлах. Операции, модифицирующие состояние объекта,
# направляются первичной реплике, которая, после выполнения метода, обновляет все остальные реплики.