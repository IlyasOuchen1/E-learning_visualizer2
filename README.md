# 📚 Template E-learning

Une application web moderne et interactive pour créer et suivre des parcours d'apprentissage personnalisés.

![E-learning Platform](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)

## ✨ Fonctionnalités

### 🎯 **Types d'activités supportées**
- **📖 Contenu textuel** : Articles, cours théoriques avec formatage Markdown
- **❓ Quiz interactifs** : Questions à choix multiples avec feedback instantané
- **🔽 Sections accordéon** : Contenu organisé en sections dépliables
- **🎥 Contenu vidéo** : Intégration de vidéos avec transcriptions
- **🖼️ Galeries d'images** : Visualisation d'images avec outils interactifs

### 🚀 **Interface utilisateur**
- **Design moderne** : Interface épurée avec Tailwind CSS
- **Navigation intuitive** : Sidebar avec progression en temps réel
- **Responsive** : Optimisé pour tous les appareils
- **Thème cohérent** : Palette de couleurs professionnelle

### 📊 **Suivi de progression**
- **Progression visuelle** : Barres de progression dynamiques
- **Sections complétées** : Marquage automatique des sections terminées
- **Sauvegarde locale** : Progression sauvegardée dans le navigateur
- **Navigation flexible** : Accès libre à toutes les sections

## 🛠️ Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes d'installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/template-elearning.git
cd template-elearning

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build
```

## 📋 Format JSON attendu

L'application accepte des fichiers JSON avec la structure suivante :

```json
{
  "metadata": {
    "titre": "Nom de votre formation",
    "sous_titre": "Description courte",
    "date_generation": "2025-01-21T10:00:00.000Z",
    "nombre_scripts": 5,
    "types_activites": ["text", "quiz", "accordion"]
  },
  "scripts": {
    "01-Intro-01_text": {
      "activite": {
        "sequence": "Introduction",
        "num_ecran": "01-Intro-01",
        "titre_ecran": "Titre de la section",
        "sous_titre": "Sous-titre",
        "resume_contenu": "Résumé du contenu",
        "type_activite": "text",
        "niveau_bloom": "Comprendre",
        "difficulte": "facile",
        "duree_estimee": 10,
        "objectif_lie": "Objectif pédagogique"
      },
      "script": "Contenu de la section..."
    }
  }
}
```

### Types d'activités supportés :
- `text` : Contenu textuel avec formatage Markdown
- `quiz` : Questions à choix multiples (format JSON dans le script)
- `accordion` : Sections dépliables
- `video` : Contenu vidéo avec métadonnées
- `image` : Galeries d'images interactives

## 🎨 Personnalisation

### Thèmes et couleurs
Les couleurs principales peuvent être modifiées dans `src/index.css` :

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --accent-color: #059669;
}
```

### Composants
Chaque type d'activité a son propre composant dans `src/components/` :
- `TextContent.tsx` - Contenu textuel
- `QuizContent.tsx` - Quiz interactifs
- `AccordionContent.tsx` - Sections accordéon
- `VideoContent.tsx` - Contenu vidéo
- `ImageContent.tsx` - Galeries d'images

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── Sidebar.tsx     # Navigation latérale
│   ├── TextContent.tsx # Contenu textuel
│   ├── QuizContent.tsx # Quiz interactifs
│   └── ...
├── data/               # Données d'exemple
├── hooks/              # Hooks personnalisés
├── utils/              # Utilitaires
├── App.tsx            # Composant principal
└── main.tsx           # Point d'entrée
```

## 🚀 Déploiement

### Netlify
```bash
npm run build
# Déployer le dossier dist/
```

### Vercel
```bash
npm run build
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Configurer GitHub Pages pour servir depuis /dist
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- 📧 Email : support@template-elearning.com
- 🐛 Issues : [GitHub Issues](https://github.com/votre-username/template-elearning/issues)
- 📖 Documentation : [Wiki](https://github.com/votre-username/template-elearning/wiki)

## 🙏 Remerciements

- [React](https://reactjs.org/) - Framework JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide React](https://lucide.dev/) - Icônes
- [Vite](https://vitejs.dev/) - Build tool

---

⭐ **N'oubliez pas de donner une étoile si ce projet vous a aidé !**