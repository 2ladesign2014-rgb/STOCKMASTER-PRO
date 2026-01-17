# 📦 Compilation Windows (.exe) - StockMaster Pro AI

Suivez ces 4 étapes pour transformer ce code en un logiciel Windows installable.

## 🏁 1. Préparation
- Installez **Node.js** sur votre PC.
- Ouvrez votre terminal dans ce dossier.
- Exécutez : `npm install`

## 💻 2. Test Rapide
Lancez l'application pour vérifier l'interface :
```bash
npm start
```

## 🏗️ 3. Génération de l'Installateur
Lancez la création du fichier `.exe` final :
```bash
npm run build
```

## 🚀 4. Résultat
- Allez dans le dossier `/dist`.
- Votre fichier est prêt : **StockMaster Pro AI_Setup_1.0.0.exe**.
- Vous pouvez maintenant l'installer sur n'importe quel ordinateur Windows.

---
**💡 Points clés pour le mode Offline :**
- L'icône du logiciel est personnalisée via `icon.ico`.
- Toutes les données sont sauvegardées localement.
- Pensez à exporter vos sauvegardes via **Configuration > Maintenance**.