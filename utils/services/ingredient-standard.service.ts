import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

// Toutes les fonctions ont u00e9tu00e9 remplacu00e9es par des appels directs au serveur MCP.
// Utilisez sqliteMCPServer.getIngredientsListViaMCP et sqliteMCPServer.addIngredientViaMCP.
