Scrum Poker
===========

List of events :
* client : room:create (id)
* client : room:freeze (id maybe useless coz from subscriptionId i can found the right room)
* client : room:reset (id maybe useless coz from subscriptionId i can found the right room)
* client : room:vote (id maybe..., vote)
* server : userId + :room:create:failure
* server : userId + :room:create:success

List of listeners :
* server : room:create => ajoute la salle dans la liste + suppression sur deco
* server : room:freeze => maj du status de la salle
* server : room:reset => maj du status de la salle
* client : room:vote => liste les votes
* client : userId + :room:create:failure
* client : userId + :room:create:success

List of autorisations :
* write : room:create : uniquement par un user authentifié
* write : room:freeze : uniquement par le créateur
* write : room:reset : uniqueemnt par le créateur
* write : room:vote : n'importe qui (devrait voter qu'une seule fois)
* read : room:create : false
* read : room:freeze : par les votant de la salle => besoin d'avoir le roomId
* read : room:reset : par les votant de la salle => besoin d'avior le roomId
* read : userId + :room:create:failure : par celui qui écoute
* read : userId + :room:create:success : par celui qui écoute

Help is welcome and new Contributor to the project would be great !
