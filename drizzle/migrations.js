// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_spooky_oracle.sql';
import m0001 from './0001_flimsy_wendell_rand.sql';
import m0002 from './0002_black_cable.sql';
import m0003 from './0003_oval_dark_beast.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
  },
};
