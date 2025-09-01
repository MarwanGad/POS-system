import { domain, clientId, audience } from '../../public/auth_config.json'

export const environment = {
    production: true,

    auth: {
        domain,
        clientId,
        redirectUrl: window.location.origin,
        audience
    }
    
};
