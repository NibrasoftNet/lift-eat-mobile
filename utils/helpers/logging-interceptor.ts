/**
 * Utilitaire pour intercepter les logs console et identifier les sources de messages spu00e9cifiques
 * Particuliu00e8rement utile pour du00e9boguer les messages 'meal undefined' qui apparaissent dans les logs
 */

import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/services/logging.service';
import { LogCategory, LogLevel } from '@/utils/enum/logging.enum';

// Compteur pour identifier uniqement chaque occurrence du message
let mealUndefinedCounter = 0;

/**
 * Configure des intercepteurs de console globaux pour identifier la source de messages spu00e9cifiques
 */
export function setupGlobalConsoleInterceptors() {
  // Sauvegarder les ru00e9fu00e9rences aux fonctions d'origine
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Rewriter pour console.log
  console.log = function(...args) {
    // Si le message contient 'meal undefined', capturer la stack trace
    if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('meal undefined')) {
      const stack = new Error().stack || 'No stack trace available';
      const id = ++mealUndefinedCounter;
      
      logger.error(LogCategory.APP, `[ID:${id}] SOURCE OF 'meal undefined' LOG: ${stack}`);
      
      // Inspecter les arguments pour voir s'ils contiennent des informations utiles
      if (args.length > 1) {
        for (let i = 1; i < args.length; i++) {
          try {
            logger.debug(LogCategory.APP, `[ID:${id}] Additional argument ${i}: ${JSON.stringify(args[i])}`); 
          } catch (e) {
            logger.debug(LogCategory.APP, `[ID:${id}] Additional argument ${i}: [Non-serializable]`);
          }
        }
      }
      
      // Analyser l'objet courant pour trouver des indices
      setTimeout(() => {
        captureCurrentContext(id);
      }, 0);
    }
    
    // Appeler la mu00e9thode originale
    originalLog.apply(console, args);
  };
  
  // Rewriter pour console.warn
  console.warn = function(...args) {
    // Si le message contient 'meal undefined'
    if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('meal undefined')) {
      const stack = new Error().stack || 'No stack trace available';
      const id = ++mealUndefinedCounter;
      
      logger.error(LogCategory.APP, `[ID:${id}] SOURCE OF 'meal undefined' WARNING: ${stack}`);
      
      // Inspecter les arguments additionnels
      if (args.length > 1) {
        for (let i = 1; i < args.length; i++) {
          try {
            logger.debug(LogCategory.APP, `[ID:${id}] Additional argument ${i}: ${JSON.stringify(args[i])}`); 
          } catch (e) {
            logger.debug(LogCategory.APP, `[ID:${id}] Additional argument ${i}: [Non-serializable]`);
          }
        }
      }
      
      // Analyser l'objet courant pour trouver des indices
      setTimeout(() => {
        captureCurrentContext(id);
      }, 0);
    }
    
    // Appeler la mu00e9thode originale
    originalWarn.apply(console, args);
  };
  
  // Rewriter pour console.error
  console.error = function(...args) {
    // Si le message contient 'meal undefined'
    if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('meal undefined')) {
      const stack = new Error().stack || 'No stack trace available';
      const id = ++mealUndefinedCounter;
      
      logger.error(LogCategory.APP, `[ID:${id}] SOURCE OF 'meal undefined' ERROR: ${stack}`);
      
      // Inspecter les arguments additionnels
      if (args.length > 1) {
        for (let i = 1; i < args.length; i++) {
          try {
            logger.debug(LogCategory.APP, `[ID:${id}] Additional argument ${i}: ${JSON.stringify(args[i])}`); 
          } catch (e) {
            logger.debug(LogCategory.APP, `[ID:${id}] Additional argument ${i}: [Non-serializable]`);
          }
        }
      }
      
      // Analyser l'objet courant pour trouver des indices
      setTimeout(() => {
        captureCurrentContext(id);
      }, 0);
    }
    
    // Appeler la mu00e9thode originale
    originalError.apply(console, args);
  };
  
  logger.info(LogCategory.APP, 'Console interceptors have been set up to track "meal undefined" logs');
}

/**
 * Fonction interne pour capturer plus d'informations sur le contexte d'exécution
 * @param id Identifiant unique de l'occurrence
 */
function captureCurrentContext(id: number) {
  try {
    // Capturer des informations de la navigation active
    if (global.location && global.location.pathname) {
      logger.debug(LogCategory.APP, `[ID:${id}] Current path: ${global.location.pathname}`);  
    }
    
    // Essayer de capturer des informations sur les hooks React actuels
    // Note: ceci est limité car React n'expose pas ces détails
    logger.debug(LogCategory.APP, `[ID:${id}] Component render context captured`);
  } catch (error) {
    logger.error(LogCategory.APP, `[ID:${id}] Error while capturing context: ${error}`); 
  }
}

/**
 * Recherche le string 'meal undefined' dans un objet ou un tableau
 * et consigne tous les chemins ou00f9 ce string est trouvu00e9
 * 
 * @param obj L'objet ou le tableau u00e0 inspecter
 * @param path Chemin actuel dans l'objet (pour l'appel ru00e9cursif)
 */
export function inspectObjectForMealUndefined(obj: any, path: string = 'root') {
  if (obj === null || obj === undefined) {
    return;
  }

  // Si c'est une chau00eene de caractu00e8res contenant 'meal undefined'
  if (typeof obj === 'string' && obj.includes('meal undefined')) {
    const id = ++mealUndefinedCounter;
    logger.error(LogCategory.APP, `[ID:${id}] Found 'meal undefined' at path: ${path}`);
    return;
  }

  // Si c'est un objet ou un tableau
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        inspectObjectForMealUndefined(obj[key], `${path}.${key}`);
      }
    }
  }
}

/**
 * Active la surveillance des objets meal et rapporte les cas ou00f9 ils sont undefined
 * @param objectName Nom de l'objet u00e0 surveiller
 * @param obj L'objet u00e0 vu00e9rifier
 * @param source Nom du composant ou de la fonction source
 */
export function monitorObjectExistence(objectName: string, obj: any, source: string) {
  const id = ++mealUndefinedCounter;
  
  if (obj === undefined) {
    logger.error(
      LogCategory.APP, 
      `[ID:${id}] ${objectName} is undefined in ${source}. Stack: ${new Error().stack}`
    );
    return false;
  } else if (objectName === 'meal' && (obj === null || obj === undefined)) {
    logger.error(
      LogCategory.APP, 
      `[ID:${id}] ${objectName} is null or undefined in ${source}. Stack: ${new Error().stack}`
    );
    return false;
  }
  
  return true;
}
