// Script de test pour l'API OpenFoodFacts
// Exécuter avec: node test-search-api.js
const https = require('https');

// Configuration
const TEST_TERM = 'pasta'; // Terme de recherche à tester
const TIMEOUT_MS = 10000; // Timeout de 10 secondes
const LANGUAGE = 'fr';
const PAGE_SIZE = 30;

console.log(`Démarrage du test avec le terme: "${TEST_TERM}"`);
console.log(`Timeout: ${TIMEOUT_MS}ms`);
console.time('Durée totale de la requête');

// Construction de l'URL de recherche OpenFoodFacts
const searchParams = new URLSearchParams({
  search_terms: TEST_TERM,
  fields: 'product_name,brands,nutriments,image_front_url,categories,nutrition_grade_fr',
  page_size: PAGE_SIZE,
  json: 1,
  lc: LANGUAGE
});

const url = `https://fr.openfoodfacts.org/cgi/search.pl?${searchParams.toString()}`;
console.log(`URL de recherche: ${url}`);

// Configuration du timeout
const timeoutId = setTimeout(() => {
  console.log('⚠️ La requête a dépassé le délai maximum et a été abandonnée');
  console.timeEnd('Durée totale de la requête');
  process.exit(1);
}, TIMEOUT_MS);

// Effectuer la requête
https.get(url, (res) => {
  let data = '';
  
  // Recevoir les données par morceaux
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // Traitement final à la fin de la réception
  res.on('end', () => {
    clearTimeout(timeoutId);
    console.timeEnd('Durée totale de la requête');
    
    try {
      const results = JSON.parse(data);
      console.log(`Statut de la réponse: ${res.statusCode}`);
      console.log(`Produits trouvés: ${results.products.length}/${results.count}`);
      
      if (results.products.length > 0) {
        console.log('\nPremier produit:');
        const firstProduct = results.products[0];
        console.log(`- Nom: ${firstProduct.product_name || 'Non spécifié'}`);
        console.log(`- Marque: ${firstProduct.brands || 'Non spécifié'}`);
        console.log(`- Nutriscore: ${firstProduct.nutrition_grade_fr || 'Non spécifié'}`);
        console.log(`- Calories: ${firstProduct.nutriments?.energy_100g || 'Non spécifié'}`);
      }
    } catch (e) {
      console.error('Erreur lors du traitement de la réponse:', e.message);
    }
  });
}).on('error', (err) => {
  clearTimeout(timeoutId);
  console.error('Erreur de connexion:', err.message);
  console.timeEnd('Durée totale de la requête');
});

// Test avec un terme différent
const testAlternative = () => {
  const alternativeTerm = 'banana';
  const alternativeParams = new URLSearchParams({
    search_terms: alternativeTerm,
    fields: 'product_name,brands',
    page_size: 5,
    json: 1,
    lc: LANGUAGE
  });
  
  const alternativeUrl = `https://fr.openfoodfacts.org/cgi/search.pl?${alternativeParams.toString()}`;
  console.log(`\nTest alternatif avec le terme: "${alternativeTerm}"`);
  console.log(`URL: ${alternativeUrl}`);
  console.time('Durée du test alternatif');
  
  https.get(alternativeUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.timeEnd('Durée du test alternatif');
      try {
        const results = JSON.parse(data);
        console.log(`Produits trouvés: ${results.products.length}/${results.count}`);
      } catch (e) {
        console.error('Erreur:', e.message);
      }
    });
  }).on('error', (err) => {
    console.error('Erreur de connexion (test alternatif):', err.message);
    console.timeEnd('Durée du test alternatif');
  });
};

// Exécuter le test alternatif après 1 seconde
setTimeout(testAlternative, 1000);
