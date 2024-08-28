import { IonFooter } from '@ionic/react';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <IonFooter className="ion-no-border" style={{ backgroundColor: '#ffff', padding: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <span className="small-font" style={{ marginRight: '10px', color: '#777' }}>Powered By:</span>
                    <img src="https://lx2.legalxgen.com/images/logo.png" alt="LegalXgen Logo" style={{ height: '30px' }} />
                </div>
                <div className="lx-logo">
                    <small style={{ fontSize: '0.8rem', fontWeight: 'bold', color:'#777' }}>version: 7.0.1</small>
                </div>
            </div>
        </IonFooter>
    );
};

export default Footer;
