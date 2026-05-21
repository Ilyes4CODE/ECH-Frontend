/** ECH SAHARA ERP — Config */
const CFG = {
  API: 'https://backend.echsahra.com',
  R: {
    LOGIN:          '/auth/login/',
    REFRESH:        '/auth/refresh/',
    PROFILE:        '/auth/profile/',
    PROFILE_UPDATE: '/auth/profile/update/',
    USERS:          '/auth/list_users/',
    USER_CREATE:    '/auth/create_user/',
    USER_DELETE:    (id) => `/auth/delete_user/${id}/`,
    USER_UPDATE:    (id) => `/auth/update_user/${id}/`,
    USER_TOGGLE:    (id) => `/auth/toggle_user_status/${id}/`,
    GROUPS:         '/auth/list_groups/',

    CAISSE_STATUS:  '/gestion/caisse/status/',
    ENCAISSEMENT:   '/gestion/caisse/encaissement/',
    DECAISSEMENT:   '/gestion/caisse/decaissement/',
    CAISSE_HISTORY: '/gestion/caisse/history/',
    CAISSE_OPS:     '/gestion/caisse/operations/',
    CAISSE_PDF:     '/gestion/caisse/operations/history/pdf/',
    OP_PDF:         (id) => `/gestion/caisse/operation/${id}/pdf/`,
    OP_UPDATE:      (id) => `/gestion/caisse/operation/${id}/update/`,
    OP_DELETE:      (id) => `/gestion/caisse/operation/${id}/delete/`,

    PROJECTS:       '/gestion/projects/',
    PROJECT_CREATE: '/gestion/projects/create/',
    PROJECT:        (id) => `/gestion/projects/${id}/`,
    PROJECT_UPDATE: (id) => `/gestion/projects/${id}/update/`,
    PROJECT_PDF:    (id) => `/gestion/projects/${id}/pdf/`,
    FINANCE_PDF:    '/gestion/projects/project-finance-pdf/',

    DETTES:         '/gestion/dettes/',
    DETTE_CREATE:   '/gestion/dettes/create/',
    DETTE:          (id) => `/gestion/dettes/${id}/`,
    DETTE_PAYMENT:  (id) => `/gestion/dettes/${id}/payment/`,
    DETTE_PDF:      (id) => `/gestion/dettes/${id}/journal/pdf/`,

    BL_LIST:        '/gestion/bon-livraison/',
    BL_CREATE:      '/gestion/bon-livraison/create/',
    BL_UPDATE:      (id) => `/gestion/bon-livraison/${id}/update/`,
    BL_DELETE:      (id) => `/gestion/bon-livraison/${id}/delete/`,
    BL_PDF:         (id) => `/gestion/bon-livraison/${id}/pdf/`,

    BC_LIST:        '/gestion/bon-commande/',
    BC_CREATE:      '/gestion/bon-commande/create/',
    BC_UPDATE:      (id) => `/gestion/bon-commande/${id}/update/`,
    BC_DELETE:      (id) => `/gestion/bon-commande/${id}/delete/`,
    BC_PDF:         (id) => `/gestion/bon-commande/${id}/pdf/`,

    MISSIONS:       '/gestion/ordre-mission/',
    MISSION_CREATE: '/gestion/ordre-mission/create/',
    MISSION:        (id) => `/gestion/ordre-mission/${id}/`,
    MISSION_UPDATE: (id) => `/gestion/ordre-mission/${id}/update/`,
    MISSION_DELETE: (id) => `/gestion/ordre-mission/${id}/delete/`,
    MISSION_PDF:    (id) => `/gestion/ordre-mission/${id}/pdf/`,

    REVENUS:        (pid) => `/gestion/api/revenus/project/${pid}/`,
    REVENU_CREATE:  '/gestion/api/revenus/create/',
    REVENU_DELETE:  (id) => `/gestion/api/revenus/${id}/delete/`,

    DASHBOARD:      '/gestion/dashboard/',
  }
};
