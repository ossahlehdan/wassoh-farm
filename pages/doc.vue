<template>
  <div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-farm-100 mb-4">
        <Icon name="lucide:book-open" size="32" class="text-farm-700" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Guide utilisateur</h1>
      <p class="text-sm text-gray-500 mt-1">Tout savoir pour utiliser Wassoh Farm efficacement</p>
    </div>

    <div class="space-y-5">
      <!-- Sommaire -->
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Icon name="lucide:list" size="18" class="text-farm-600" />
          Sommaire
        </h2>
        <nav class="grid grid-cols-2 gap-x-4 gap-y-1">
          <a v-for="section in sections" :key="section.id" :href="`#${section.id}`"
            class="flex items-center gap-2 text-sm text-farm-600 hover:text-farm-800 py-1 rounded transition-colors">
            <Icon :name="section.icon" size="14" class="flex-shrink-0" />
            {{ section.title }}
          </a>
        </nav>
      </div>

      <!-- Présentation -->
      <div id="presentation" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-farm-50 px-5 py-3 border-b border-farm-100">
          <h2 class="text-base font-semibold text-farm-800 flex items-center gap-2">
            <Icon name="lucide:info" size="18" />
            Présentation
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            <strong>Wassoh Farm</strong> est une application de gestion complète pour votre exploitation agricole.
            Elle couvre tout le cycle de production, de la pépinière jusqu'a la vente, en passant par la gestion des stocks et des finances.
          </p>
          <div class="bg-farm-50/50 rounded-lg p-4">
            <p class="text-xs font-semibold text-farm-700 uppercase tracking-wide mb-2">Fonctionnalités principales</p>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="lucide:flower-2" size="14" class="text-purple-500" />
                Gestion des pepinieres
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="lucide:sprout" size="14" class="text-green-500" />
                Suivi des cultures
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="lucide:wheat" size="14" class="text-yellow-600" />
                Enregistrement des recoltes
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="lucide:trending-up" size="14" class="text-farm-600" />
                Suivi des ventes
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="lucide:trending-down" size="14" class="text-red-500" />
                Gestion des depenses
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="lucide:package" size="14" class="text-blue-500" />
                Stock d'intrants
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">
            Toutes les valeurs financieres sont en <strong class="text-farm-700">GNF</strong> (Franc guineen).
            L'application fonctionne sur mobile et ordinateur.
          </p>
        </div>
      </div>

      <!-- Schéma des données -->
      <div id="schema" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-blue-50 px-5 py-3 border-b border-blue-100">
          <h2 class="text-base font-semibold text-blue-800 flex items-center gap-2">
            <Icon name="lucide:git-branch" size="18" />
            Comment les donnees sont liees
          </h2>
        </div>
        <div class="p-5">
          <p class="text-sm text-gray-600 mb-4">Chaque element est connecte aux autres pour une tracabilite complete :</p>
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <!-- Flow visuel -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-semibold">
                  <Icon name="lucide:flower-2" size="12" /> Pepiniere
                </span>
                <Icon name="lucide:arrow-right" size="14" class="text-gray-400" />
                <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                  <Icon name="lucide:sprout" size="12" /> Culture
                </span>
                <Icon name="lucide:arrow-right" size="14" class="text-gray-400" />
                <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-semibold">
                  <Icon name="lucide:wheat" size="12" /> Recolte
                </span>
                <Icon name="lucide:arrow-right" size="14" class="text-gray-400" />
                <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-farm-100 text-farm-700 text-xs font-semibold">
                  <Icon name="lucide:trending-up" size="12" /> Vente
                </span>
              </div>
              <div class="flex items-center gap-2 ml-[136px]">
                <Icon name="lucide:corner-down-right" size="14" class="text-gray-400" />
                <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                  <Icon name="lucide:trending-down" size="12" /> Depense
                </span>
                <span class="text-xs text-gray-400">(optionnel)</span>
              </div>
            </div>
            <div class="border-t border-gray-200 pt-3 mt-3 flex items-center gap-2">
              <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-semibold">
                <Icon name="lucide:shopping-cart" size="12" /> Achat intrant
              </span>
              <Icon name="lucide:arrow-right" size="14" class="text-gray-400" />
              <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                <Icon name="lucide:package" size="12" /> Stock
              </span>
              <span class="text-gray-400 text-xs">+</span>
              <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                <Icon name="lucide:trending-down" size="12" /> Depense auto
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rôles -->
      <div id="roles" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-purple-50 px-5 py-3 border-b border-purple-100">
          <h2 class="text-base font-semibold text-purple-800 flex items-center gap-2">
            <Icon name="lucide:shield" size="18" />
            Roles et permissions
          </h2>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold">ADMIN</span>
              </div>
              <ul class="text-sm text-gray-600 space-y-1.5">
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:check" size="14" class="text-green-500 mt-0.5 flex-shrink-0" />
                  Acces complet a tous les sites
                </li>
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:check" size="14" class="text-green-500 mt-0.5 flex-shrink-0" />
                  Ajouter, modifier, supprimer
                </li>
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:check" size="14" class="text-green-500 mt-0.5 flex-shrink-0" />
                  Gestion des utilisateurs et sites
                </li>
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:check" size="14" class="text-green-500 mt-0.5 flex-shrink-0" />
                  Achats et transferts d'intrants
                </li>
              </ul>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 text-xs font-bold">EMPLOYE</span>
              </div>
              <ul class="text-sm text-gray-600 space-y-1.5">
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:check" size="14" class="text-green-500 mt-0.5 flex-shrink-0" />
                  Donnees de son site uniquement
                </li>
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:check" size="14" class="text-green-500 mt-0.5 flex-shrink-0" />
                  Ajouter et modifier
                </li>
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:x" size="14" class="text-red-400 mt-0.5 flex-shrink-0" />
                  Pas de suppression
                </li>
                <li class="flex items-start gap-1.5">
                  <Icon name="lucide:x" size="14" class="text-red-400 mt-0.5 flex-shrink-0" />
                  Pas d'acces a l'administration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau de bord -->
      <div id="dashboard" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-farm-50 px-5 py-3 border-b border-farm-100">
          <h2 class="text-base font-semibold text-farm-800 flex items-center gap-2">
            <Icon name="lucide:layout-dashboard" size="18" />
            Tableau de bord
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            La page d'accueil donne une vue d'ensemble de votre exploitation en temps reel :
          </p>
          <div class="grid grid-cols-2 gap-2">
            <div class="p-3 bg-farm-50 rounded-lg">
              <p class="text-xs font-semibold text-farm-700">Solde</p>
              <p class="text-xs text-gray-500 mt-0.5">Ventes - Depenses (incluant les achats d'intrants)</p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <p class="text-xs font-semibold text-green-700">Total ventes</p>
              <p class="text-xs text-gray-500 mt-0.5">Somme de toutes les ventes</p>
            </div>
            <div class="p-3 bg-red-50 rounded-lg">
              <p class="text-xs font-semibold text-red-700">Total depenses</p>
              <p class="text-xs text-gray-500 mt-0.5">Depenses manuelles + achats d'intrants</p>
            </div>
            <div class="p-3 bg-yellow-50 rounded-lg">
              <p class="text-xs font-semibold text-yellow-700">Cultures en cours</p>
              <p class="text-xs text-gray-500 mt-0.5">Nombre de cultures actives</p>
            </div>
          </div>
          <p class="text-sm text-gray-600">
            Des raccourcis vers les recoltes, pepinieres et intrants sont disponibles, ainsi que les 5 dernieres activites financieres.
          </p>
        </div>
      </div>

      <!-- Pépinières -->
      <div id="pepinieres" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-purple-50 px-5 py-3 border-b border-purple-100">
          <h2 class="text-base font-semibold text-purple-800 flex items-center gap-2">
            <Icon name="lucide:flower-2" size="18" />
            Pepinieres
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            Les pepinieres preparent les semis avant leur mise en terre. Le suivi se fait par boites. C'est la premiere etape du cycle de culture.
          </p>
          <div class="space-y-2">
            <div class="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <Icon name="lucide:plus-circle" size="16" class="text-farm-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-gray-700">Creer une pepiniere</p>
                <p class="text-xs text-gray-500">Indiquez la variete (ex: Riz NERICA), le site, le nombre de boites semees et la date de semis</p>
              </div>
            </div>
            <div class="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <Icon name="lucide:bar-chart" size="16" class="text-farm-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-gray-700">Suivre la viabilite</p>
                <p class="text-xs text-gray-500">Mettez a jour le nombre de boites viables. Le taux de viabilite se calcule automatiquement</p>
              </div>
            </div>
            <div class="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <Icon name="lucide:arrow-right-circle" size="16" class="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-gray-700">Transplanter</p>
                <p class="text-xs text-gray-500">Le bouton <strong>Transplanter</strong> cree automatiquement une culture liee. Choisissez la parcelle de destination, la superficie et la date</p>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">En cours</span>
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">Prete</span>
            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">Transplantee</span>
            <span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">Perdue</span>
          </div>
        </div>
      </div>

      <!-- Cultures -->
      <div id="cultures" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-green-50 px-5 py-3 border-b border-green-100">
          <h2 class="text-base font-semibold text-green-800 flex items-center gap-2">
            <Icon name="lucide:sprout" size="18" />
            Cultures
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            Suivez chaque culture plantee sur vos parcelles, du semis jusqu'a la recolte.
          </p>
          <ul class="text-sm text-gray-600 space-y-1.5">
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Renseignez le nom, le site, la superficie (ha, m2, acres) et la date de semis
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Les cultures issues d'une pepiniere affichent un badge <span class="text-purple-500 font-medium">violet</span>
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Vous pouvez lier des depenses a une culture pour suivre les couts par culture
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Les employes sont automatiquement assignes a leur site
            </li>
          </ul>
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">En cours</span>
            <Icon name="lucide:arrow-right" size="12" class="text-gray-400 self-center" />
            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">Recoltee</span>
            <span class="text-gray-400 text-xs self-center">ou</span>
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">Abandonnee</span>
          </div>
        </div>
      </div>

      <!-- Récoltes -->
      <div id="recoltes" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-yellow-50 px-5 py-3 border-b border-yellow-100">
          <h2 class="text-base font-semibold text-yellow-800 flex items-center gap-2">
            <Icon name="lucide:wheat" size="18" />
            Recoltes
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            Enregistrez chaque recolte pour une culture en cours. Seules les cultures avec le statut <strong>En cours</strong> apparaissent dans la liste.
          </p>
          <ul class="text-sm text-gray-600 space-y-1.5">
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Selectionnez la culture, indiquez la quantite et la date
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Evaluez la qualite : <span class="text-green-600 font-medium">bonne</span>, <span class="text-yellow-600 font-medium">moyenne</span> ou <span class="text-red-500 font-medium">mauvaise</span>
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Chaque recolte peut ensuite etre vendue depuis la page Ventes
            </li>
          </ul>
          <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <p class="text-xs font-semibold text-yellow-700 mb-1">Unites disponibles</p>
            <p class="text-xs text-gray-600">kg, tonne, sac, Seau (petit), Seau (grand), botte, caisse, panier</p>
          </div>
        </div>
      </div>

      <!-- Ventes -->
      <div id="ventes" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-farm-50 px-5 py-3 border-b border-farm-100">
          <h2 class="text-base font-semibold text-farm-800 flex items-center gap-2">
            <Icon name="lucide:trending-up" size="18" />
            Ventes
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            Chaque vente est obligatoirement liee a une recolte. Le libelle est genere automatiquement depuis le nom de la culture.
          </p>
          <div class="p-3 bg-farm-50 rounded-lg border border-farm-100">
            <p class="text-xs font-semibold text-farm-700 mb-1">Comment ca marche</p>
            <ol class="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Selectionnez la recolte a vendre (l'unite se pre-remplit automatiquement)</li>
              <li>Indiquez la quantite vendue et le prix unitaire en GNF</li>
              <li>Le total est calcule automatiquement</li>
              <li>Ajoutez le nom de l'acheteur si vous le connaissez</li>
            </ol>
          </div>
          <ul class="text-sm text-gray-600 space-y-1.5">
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Le libelle "Vente de [culture]" est cree automatiquement
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              L'admin choisit le site ; l'employe est auto-assigne
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Les ventes alimentent le solde du tableau de bord
            </li>
          </ul>
        </div>
      </div>

      <!-- Dépenses -->
      <div id="depenses" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-red-50 px-5 py-3 border-b border-red-100">
          <h2 class="text-base font-semibold text-red-800 flex items-center gap-2">
            <Icon name="lucide:trending-down" size="18" />
            Depenses
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            Les depenses regroupent toutes les sorties d'argent de l'exploitation. Il y a deux types :
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-sm font-semibold text-gray-700 mb-1">Depenses manuelles</p>
              <p class="text-xs text-gray-500">Main d'oeuvre, transport, carburant, location terrain, eau/irrigation, etc.</p>
              <p class="text-xs text-gray-500 mt-1">Vous les ajoutez vous-meme avec le libelle, le montant et la categorie.</p>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div class="flex items-center gap-1.5 mb-1">
                <p class="text-sm font-semibold text-orange-700">Achats d'intrants</p>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">AUTO</span>
              </div>
              <p class="text-xs text-gray-500">Creees automatiquement quand vous achetez un intrant. Non modifiables ici.</p>
              <p class="text-xs text-gray-500 mt-1">Gerez-les depuis la page Intrants &gt; Achats.</p>
            </div>
          </div>
          <ul class="text-sm text-gray-600 space-y-1.5">
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Vous pouvez lier une depense a une culture pour tracer les couts par culture
            </li>
            <li class="flex items-start gap-1.5">
              <Icon name="lucide:check" size="14" class="text-farm-500 mt-0.5 flex-shrink-0" />
              Categories : Semences, Engrais, Pesticides, Main d'oeuvre, Materiel, Transport, Eau/irrigation, Location terrain, Carburant, Autre
            </li>
          </ul>
        </div>
      </div>

      <!-- Intrants -->
      <div id="intrants" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-blue-50 px-5 py-3 border-b border-blue-100">
          <h2 class="text-base font-semibold text-blue-800 flex items-center gap-2">
            <Icon name="lucide:package" size="18" />
            Intrants
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            Gerez le stock de matieres premieres : semences, engrais, pesticides, materiel.
            Le module se divise en trois sous-pages (admin uniquement pour les ecritures) :
          </p>
          <div class="space-y-2">
            <div class="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="lucide:package" size="14" class="text-blue-600" />
                <p class="text-sm font-semibold text-blue-700">Inventaire</p>
              </div>
              <p class="text-xs text-gray-600">Catalogue de tous les intrants avec les quantites en stock par site. L'admin cree les types d'intrants (nom, categorie, unite).</p>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="lucide:shopping-cart" size="14" class="text-orange-600" />
                <p class="text-sm font-semibold text-orange-700">Achats</p>
              </div>
              <p class="text-xs text-gray-600">Enregistrez un achat avec le fournisseur, la quantite et le prix. <strong>Trois choses se passent automatiquement :</strong></p>
              <ol class="text-xs text-gray-600 mt-1 list-decimal list-inside space-y-0.5">
                <li>Le stock central augmente</li>
                <li>Une depense est creee avec la bonne categorie</li>
                <li>Le solde du dashboard est mis a jour</li>
              </ol>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="lucide:arrow-left-right" size="14" class="text-gray-600" />
                <p class="text-sm font-semibold text-gray-700">Transferts</p>
              </div>
              <p class="text-xs text-gray-600">Deplacez des intrants entre l'entrepot central et les sites, ou entre sites. Le stock source est verifie avant le transfert.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Administration -->
      <div id="administration" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-gray-100 px-5 py-3 border-b border-gray-200">
          <h2 class="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="lucide:settings" size="18" />
            Administration
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm text-gray-600 leading-relaxed">
            Accessible uniquement aux administrateurs. Trois sous-pages :
          </p>
          <div class="space-y-2">
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="lucide:map-pin" size="14" class="text-farm-600" />
                <p class="text-sm font-semibold text-gray-700">Sites / Parcelles</p>
              </div>
              <p class="text-xs text-gray-600">Creez et gerez vos parcelles avec nom, localisation et superficie. Les sites sont la base de toute l'application : cultures, pepinieres, stock, etc.</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="lucide:users" size="14" class="text-blue-600" />
                <p class="text-sm font-semibold text-gray-700">Utilisateurs</p>
              </div>
              <p class="text-xs text-gray-600">Creez des comptes employe (assignes a un site) ou administrateur. Chaque employe ne voit que les donnees de son site.</p>
            </div>
            <div class="p-3 bg-red-50 rounded-lg border border-red-100">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="lucide:alert-triangle" size="14" class="text-red-600" />
                <p class="text-sm font-semibold text-red-700">Parametres</p>
              </div>
              <p class="text-xs text-gray-600">Reinitialisation complete du projet. <strong>Attention : toutes les donnees sont supprimees definitivement.</strong> Vous devrez taper "REINITIALISER" pour confirmer.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Flux de travail -->
      <div id="workflow" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-farm-50 px-5 py-3 border-b border-farm-100">
          <h2 class="text-base font-semibold text-farm-800 flex items-center gap-2">
            <Icon name="lucide:route" size="18" />
            Flux de travail recommande
          </h2>
        </div>
        <div class="p-5">
          <div class="relative space-y-0">
            <div v-for="(step, index) in workflowSteps" :key="index" class="flex gap-4 pb-6 last:pb-0">
              <!-- Line -->
              <div class="flex flex-col items-center">
                <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  :class="step.color">
                  {{ index + 1 }}
                </span>
                <div v-if="index < workflowSteps.length - 1" class="w-0.5 flex-1 mt-1 bg-gray-200" />
              </div>
              <!-- Content -->
              <div class="pt-1">
                <p class="text-sm font-semibold text-gray-800">{{ step.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div id="navigation" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-gray-100 px-5 py-3 border-b border-gray-200">
          <h2 class="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="lucide:smartphone" size="18" />
            Navigation
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="lucide:monitor" size="14" class="text-gray-600" />
                <p class="text-sm font-semibold text-gray-700">Ordinateur</p>
              </div>
              <p class="text-xs text-gray-600">Menu lateral gauche toujours visible avec toutes les sections</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="lucide:smartphone" size="14" class="text-gray-600" />
                <p class="text-sm font-semibold text-gray-700">Mobile</p>
              </div>
              <p class="text-xs text-gray-600">Barre en bas pour les acces rapides. Appuyez sur <strong>Plus</strong> pour le menu complet en tiroir</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div id="faq" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-yellow-50 px-5 py-3 border-b border-yellow-100">
          <h2 class="text-base font-semibold text-yellow-800 flex items-center gap-2">
            <Icon name="lucide:help-circle" size="18" />
            Questions frequentes
          </h2>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <p class="text-sm font-semibold text-gray-800">Pourquoi je ne vois pas toutes les donnees ?</p>
            <p class="text-xs text-gray-500 mt-0.5">Si vous etes employe, vous ne voyez que les donnees de votre site assigne. Contactez un administrateur pour changer votre affectation.</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Pourquoi je ne peux pas supprimer ?</p>
            <p class="text-xs text-gray-500 mt-0.5">Seuls les administrateurs peuvent supprimer des enregistrements. Vous pouvez modifier les donnees existantes.</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Comment voir le cout total d'une culture ?</p>
            <p class="text-xs text-gray-500 mt-0.5">Dans Depenses, liez vos depenses a une culture via le champ "Culture associee". Cela permet de tracer les couts par culture.</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Pourquoi une depense avec le badge "Achat intrant" n'est pas modifiable ?</p>
            <p class="text-xs text-gray-500 mt-0.5">Ces depenses sont generees automatiquement lors d'un achat d'intrant. Pour les modifier, allez dans Intrants &gt; Achats.</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Comment fonctionne le solde du tableau de bord ?</p>
            <p class="text-xs text-gray-500 mt-0.5">Solde = Total des ventes - Total des depenses. Les depenses incluent les depenses manuelles ET les achats d'intrants automatiques.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sections = [
  { id: 'presentation', title: 'Presentation', icon: 'lucide:info' },
  { id: 'schema', title: 'Liens entre donnees', icon: 'lucide:git-branch' },
  { id: 'roles', title: 'Roles et permissions', icon: 'lucide:shield' },
  { id: 'dashboard', title: 'Tableau de bord', icon: 'lucide:layout-dashboard' },
  { id: 'pepinieres', title: 'Pepinieres', icon: 'lucide:flower-2' },
  { id: 'cultures', title: 'Cultures', icon: 'lucide:sprout' },
  { id: 'recoltes', title: 'Recoltes', icon: 'lucide:wheat' },
  { id: 'ventes', title: 'Ventes', icon: 'lucide:trending-up' },
  { id: 'depenses', title: 'Depenses', icon: 'lucide:trending-down' },
  { id: 'intrants', title: 'Intrants', icon: 'lucide:package' },
  { id: 'administration', title: 'Administration', icon: 'lucide:settings' },
  { id: 'workflow', title: 'Flux de travail', icon: 'lucide:route' },
  { id: 'navigation', title: 'Navigation', icon: 'lucide:smartphone' },
  { id: 'faq', title: 'Questions frequentes', icon: 'lucide:help-circle' },
]

const workflowSteps = [
  { title: 'Creer les sites', desc: 'Ajoutez vos parcelles dans Administration > Sites avec leur nom, localisation et superficie', color: 'bg-gray-200 text-gray-700' },
  { title: 'Configurer les intrants', desc: 'Creez le catalogue d\'intrants (semences, engrais...) et enregistrez les premiers achats', color: 'bg-blue-100 text-blue-700' },
  { title: 'Preparer les pepinieres', desc: 'Semez vos boites, suivez la viabilite et notez les boites viables', color: 'bg-purple-100 text-purple-700' },
  { title: 'Transplanter ou semer', desc: 'Transplantez depuis une pepiniere ou creez une culture directement sur un site', color: 'bg-green-100 text-green-700' },
  { title: 'Enregistrer les recoltes', desc: 'Ajoutez la quantite recoltee avec l\'unite et la qualite pour chaque culture en cours', color: 'bg-yellow-100 text-yellow-700' },
  { title: 'Vendre les recoltes', desc: 'Liez chaque vente a une recolte. Le libelle et l\'unite se remplissent automatiquement', color: 'bg-farm-100 text-farm-700' },
  { title: 'Suivre les depenses', desc: 'Les achats d\'intrants creent des depenses automatiques. Ajoutez les depenses manuelles (main d\'oeuvre, transport...)', color: 'bg-red-100 text-red-700' },
]
</script>
