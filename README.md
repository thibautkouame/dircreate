# ALLCMDS CLI ✨

Un outil en ligne de commande (CLI) conçu pour simplifier la création de projets en regroupant toutes les commandes nécessaires. Plus besoin de chercher la commande dont vous avez besoin, plus besoin de mémorisation.

## 🚀 Fonctionnalités

- **Interface interactive** : Sélection simple et intuitive du type de projet
- **Support multi-frameworks** : Next.js, Expo, Vite, NestJS, Laravel
- **Gestion des options** : Possibilité d'ajouter des options personnalisées aux générateurs
- **Vérification des prérequis** : Contrôle automatique des dépendances nécessaires
- **Interface colorée** : Utilisation de couleurs pour une meilleure expérience utilisateur

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Pour Laravel : Composer installé sur votre système

## 🔧 Installation

### Installation globale (recommandée)

```bash
npm install -g all-cmd
```

### Installation locale

```bash
npm install all-cmd
```

## 🎯 Utilisation

### Commande globale

```bash
allcmds
```

### Commande locale

```bash
npx all-cmd
```

## 📱 Types de projets supportés

1. **Next.js** - Framework React full-stack
2. **Expo** - Framework React Native
3. **Vite** - Build tool moderne avec support React/TypeScript
4. **NestJS** - Framework Node.js pour applications évolutives
5. **Laravel** - Framework PHP élégant

## 🔄 Processus d'utilisation

1. Lancez la commande `allcmds`
2. Sélectionnez le type de projet dans la liste
3. Entrez le nom du dossier du projet
4. Ajoutez des options supplémentaires si nécessaire (ex: `--use-npm --ts`)
5. Le CLI exécute automatiquement la commande de création

## 📝 Exemples d'options

- **Vite** : `--template react-ts` pour TypeScript
- **Next.js** : `--typescript --tailwind --eslint`
- **Expo** : `--template blank-typescript`

## 🛠️ Développement

### Structure du projet

```
all-cmd/
├── bin/
│   └── index.js          # Point d'entrée principal
├── package.json          # Configuration et dépendances
└── README.md            # Documentation
```

### Dépendances principales

- `inquirer` : Interface interactive en ligne de commande
- `execa` : Exécution de commandes système
- `chalk` : Coloration du terminal
- `clear` : Nettoyage de l'écran

### Installation des dépendances de développement

```bash
npm install
```

## 🚨 Dépannage

### Erreur "Missing prerequisites"

Si vous obtenez une erreur de prérequis manquant (ex: Composer pour Laravel), installez d'abord l'outil requis sur votre système.

### Problèmes de permissions

Sur certains systèmes, vous pourriez avoir besoin de permissions administrateur pour l'installation globale :

```bash
sudo npm install -g all-cmd
```

## 📄 Licence

ISC - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Thibaut Kouamé**

- GitHub : [@thibautkouame](https://github.com/thibautkouame)
- Repository : [dircreate](https://github.com/thibautkouame/dircreate)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Si vous rencontrez des problèmes ou avez des questions :

- Ouvrez une [issue](https://github.com/thibautkouame/dircreate/issues) sur GitHub
- Consultez la documentation de votre framework préféré

---

**Note** : Ce CLI est conçu pour simplifier la création de projets. Il utilise les outils officiels de chaque framework, garantissant ainsi la compatibilité et la stabilité.
