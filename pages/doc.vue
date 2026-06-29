<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Guide utilisateur</h1>

    <div class="space-y-4">
      <!-- Sommaire -->
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Sommaire</h2>
        <nav class="space-y-1">
          <a v-for="section in sections" :key="section.id" :href="`#${section.id}`"
            class="block text-sm text-farm-600 hover:text-farm-800 hover:underline py-0.5">
            {{ section.title }}
          </a>
        </nav>
      </div>

      <!-- Présentation -->
      <div id="presentation" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Présentation</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          <strong>Wassoh Farm</strong> est une application de gestion agricole qui permet de suivre l'ensemble des activités
          d'une exploitation : pépinières, cultures, récoltes, ventes, dépenses et intrants.
          Toutes les valeurs financières sont exprimées en <strong>GNF</strong> (Franc guinéen).
        </p>
        <p class="text-sm text-gray-600 leading-relaxed mt-2">
          L'application est accessible sur mobile et ordinateur. Elle fonctionne avec deux types de comptes :
          <strong>Administrateur</strong> et <strong>Employé</strong>.
        </p>
      </div>

      <!-- Rôles -->
      <div id="roles" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Rôles et permissions</h2>
        <div class="space-y-3">
          <div class="p-3 bg-purple-50 rounded-lg">
            <p class="text-sm font-semibold text-purple-700">Administrateur</p>
            <ul class="text-sm text-gray-600 mt-1 space-y-0.5 list-disc list-inside">
              <li>Accès complet : toutes les pages et tous les sites</li>
              <li>Peut ajouter, modifier et <strong>supprimer</strong> des enregistrements</li>
              <li>Gère les sites, les utilisateurs et les paramètres</li>
              <li>Gère les intrants (inventaire, achats, transferts)</li>
            </ul>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <p class="text-sm font-semibold text-blue-700">Employé</p>
            <ul class="text-sm text-gray-600 mt-1 space-y-0.5 list-disc list-inside">
              <li>Voit uniquement les données de son site assigné</li>
              <li>Peut ajouter et modifier des enregistrements</li>
              <li>Ne peut pas supprimer d'enregistrements</li>
              <li>N'a pas accès à l'administration</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tableau de bord -->
      <div id="dashboard" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Tableau de bord</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          La page d'accueil affiche un résumé de votre exploitation :
        </p>
        <ul class="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li><strong>Solde</strong> : différence entre les ventes et les dépenses</li>
          <li><strong>Total des ventes</strong> : somme de toutes les ventes enregistrées</li>
          <li><strong>Total des dépenses</strong> : somme de toutes les dépenses enregistrées</li>
          <li><strong>Cultures en cours</strong> : nombre de cultures actives</li>
          <li><strong>Activité récente</strong> : les 5 dernières ventes et dépenses</li>
        </ul>
      </div>

      <!-- Pépinières -->
      <div id="pepinieres" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Pépinières</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          Les pépinières servent à préparer les plants avant leur mise en terre.
        </p>
        <ul class="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Indiquez la variété, le site, le nombre de plants semés et la date de semis</li>
          <li>Mettez à jour le nombre de <strong>plants viables</strong> après germination pour calculer le taux de germination</li>
          <li>Changez le statut : <span class="text-yellow-600 font-medium">En cours</span>, <span class="text-green-600 font-medium">Prête</span>, <span class="text-red-500 font-medium">Perdue</span></li>
          <li>Utilisez le bouton <strong>Transplanter</strong> pour créer automatiquement une culture liée à cette pépinière</li>
        </ul>
      </div>

      <!-- Cultures -->
      <div id="cultures" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Cultures</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          Suivez toutes les cultures plantées sur vos parcelles.
        </p>
        <ul class="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Renseignez le nom de la culture, le site, la superficie et la date de semis</li>
          <li>Statut : <span class="text-green-600 font-medium">En cours</span> &rarr; <span class="text-blue-600 font-medium">Récoltée</span> ou <span class="text-gray-500 font-medium">Abandonnée</span></li>
          <li>Les cultures issues d'une transplantation de pépinière sont marquées d'un badge violet</li>
        </ul>
      </div>

      <!-- Récoltes -->
      <div id="recoltes" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Récoltes</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          Enregistrez les récoltes de chaque culture.
        </p>
        <ul class="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Sélectionnez la culture concernée</li>
          <li>Indiquez la quantité et l'unité : kg, tonne, sac, <strong>Seau (petit)</strong>, <strong>Seau (grand)</strong>, botte, caisse, panier</li>
          <li>Évaluez la qualité : bonne, moyenne ou mauvaise</li>
          <li>Les récoltes peuvent être liées à une vente</li>
        </ul>
      </div>

      <!-- Ventes -->
      <div id="ventes" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Ventes</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          Enregistrez les ventes de vos produits agricoles.
        </p>
        <ul class="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Vous pouvez lier une vente à une <strong>récolte</strong> pour tracer l'origine du produit vendu</li>
          <li>Renseignez le libellé, la quantité, l'unité et le prix unitaire en GNF</li>
          <li>Le montant total est calculé automatiquement (quantité &times; prix unitaire)</li>
          <li>Ajoutez le nom de l'acheteur si connu</li>
          <li>L'administrateur peut choisir le site ; pour les employés, le site est automatiquement assigné</li>
        </ul>
      </div>

      <!-- Dépenses -->
      <div id="depenses" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Dépenses</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          Suivez toutes les dépenses de l'exploitation.
        </p>
        <ul class="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Catégories disponibles : Semences, Engrais, Pesticides, Main d'&oelig;uvre, Matériel, Transport, Eau/irrigation, Location terrain, Carburant, Autre</li>
          <li>Le montant est en GNF</li>
          <li>L'administrateur peut assigner un site à la dépense</li>
        </ul>
      </div>

      <!-- Intrants -->
      <div id="intrants" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Intrants</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          Le module intrants gère le stock de matières premières (semences, engrais, pesticides, matériel).
          Il comprend trois sous-pages :
        </p>
        <div class="mt-3 space-y-2">
          <div class="p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-700">Inventaire</p>
            <p class="text-sm text-gray-600">Catalogue des intrants avec leurs quantités en stock par site. L'administrateur peut créer de nouveaux types d'intrants.</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-700">Achats</p>
            <p class="text-sm text-gray-600">Enregistrement des achats d'intrants avec fournisseur, quantité et prix. Le stock central est mis à jour automatiquement.</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-700">Transferts</p>
            <p class="text-sm text-gray-600">Transfert d'intrants entre l'entrepôt central et les sites, ou entre sites. Le stock est vérifié et mis à jour automatiquement.</p>
          </div>
        </div>
      </div>

      <!-- Administration -->
      <div id="administration" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Administration</h2>
        <p class="text-sm text-gray-600 leading-relaxed">
          Accessible uniquement aux administrateurs.
        </p>
        <div class="mt-3 space-y-2">
          <div class="p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-700">Sites / Parcelles</p>
            <p class="text-sm text-gray-600">Créez et gérez les sites de votre exploitation avec leur localisation et superficie.</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-700">Utilisateurs</p>
            <p class="text-sm text-gray-600">Gérez les comptes : créez des employés assignés à un site, ou d'autres administrateurs.</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-700">Paramètres</p>
            <p class="text-sm text-gray-600">Permet la réinitialisation complète du projet. <strong class="text-red-500">Attention : cette action supprime toutes les données !</strong></p>
          </div>
        </div>
      </div>

      <!-- Flux de travail -->
      <div id="workflow" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Flux de travail recommandé</h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-farm-100 text-farm-700 flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p class="text-sm font-medium text-gray-800">Créer les sites</p>
              <p class="text-xs text-gray-500">Ajoutez vos parcelles dans Administration &gt; Sites</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-farm-100 text-farm-700 flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p class="text-sm font-medium text-gray-800">Préparer les pépinières</p>
              <p class="text-xs text-gray-500">Semez vos plants et suivez la germination</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-farm-100 text-farm-700 flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p class="text-sm font-medium text-gray-800">Transplanter ou semer en plein champ</p>
              <p class="text-xs text-gray-500">Créez vos cultures directement ou via la transplantation</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-farm-100 text-farm-700 flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p class="text-sm font-medium text-gray-800">Enregistrer les récoltes</p>
              <p class="text-xs text-gray-500">Ajoutez la quantité récoltée pour chaque culture</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-farm-100 text-farm-700 flex items-center justify-center text-sm font-bold">5</span>
            <div>
              <p class="text-sm font-medium text-gray-800">Vendre et suivre les dépenses</p>
              <p class="text-xs text-gray-500">Liez vos ventes aux récoltes et enregistrez vos dépenses pour suivre le solde</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div id="navigation" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Navigation</h2>
        <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li><strong>Sur ordinateur</strong> : utilisez le menu latéral à gauche</li>
          <li><strong>Sur mobile</strong> : utilisez la barre de navigation en bas de l'écran pour les accès rapides, ou appuyez sur <strong>Plus</strong> pour voir le menu complet</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sections = [
  { id: 'presentation', title: 'Présentation' },
  { id: 'roles', title: 'Rôles et permissions' },
  { id: 'dashboard', title: 'Tableau de bord' },
  { id: 'pepinieres', title: 'Pépinières' },
  { id: 'cultures', title: 'Cultures' },
  { id: 'recoltes', title: 'Récoltes' },
  { id: 'ventes', title: 'Ventes' },
  { id: 'depenses', title: 'Dépenses' },
  { id: 'intrants', title: 'Intrants' },
  { id: 'administration', title: 'Administration' },
  { id: 'workflow', title: 'Flux de travail recommandé' },
  { id: 'navigation', title: 'Navigation' },
]
</script>
