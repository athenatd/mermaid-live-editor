<script lang="ts">
	import { updateCode } from '$lib/util/state';
	import Card from '$lib/components/card/card.svelte';

	const samples = {
    'Function Flow':`erDiagram
    SUPPLIER ||..|| FUNDING-SOURCES : Is
    SUPPLIER-OPTIONAL {
        bool crossbordertransfer "Support cross border remittance service"
        bool crossborderpayment "Support cross border payment service"
        bool cryptocurrencyloan "Support crypto currency loan service"
        bool cryptocurrencyexchange "Support crypto currency exchange service"
        bool cryptocurrencypayment "Support crypto currency payment service"
    }
    FUNDING-SOURCES ||--o| SUPPLIER-OPTIONAL : Optional
    SUPPLIER-OPTIONAL ||--o| DPAY-FIAT-API : Throw
    SUPPLIER-OPTIONAL ||--o| DPAY-CRYPTO-API : Throw
    SUPPLIER-DEFAULT {
        bool localfiatloan "Support local fiat loan service"
        bool localfiattransfer "Support local fiat transfer service"
        bool localfiatpayment  "Support local fiat payment service"
    }
    FUNDING-SOURCES ||--o| SUPPLIER-DEFAULT : Provides
    SUPPLIER-DEFAULT ||--o| DPAY-FIAT-API : Throw
    SUPPLIER-DEFAULT ||--o| DPAY-CRYPTO-API : Throw
    DPAY-FIAT-API ||--o| DPAY-COMPOSITE-GATEWAY : To
    DPAY-CRYPTO-API ||--o| DPAY-COMPOSITE-GATEWAY : To
    SUPPLIER-GET {
        string globalpaymentsupport "Get global Safety payment capabilities"
        string globaltransfersupport "Get global cheap and fast remittance capabilities"
        string connectwebsitesupport "Get secure transmission of sensitive data by ETEE connection"
        string connectcrmsoftwaresupport "Get automated processes by dpay IFTE module"
        string cryptocurrencysupport "Get ability to handle cryptocurrency services"
    }
    DPAY-COMPOSITE-GATEWAY ||--o| DPAY-SUPPLIER-APP : Service
    DPAY-SUPPLIER-APP ||--o| SUPPLIER-GET : Provides
    SUPPLIER-GET ||--o| FUNDING-SOURCES : To
    MERCHANT ||..|| COMMODITY-SOURCES : Is
    DPAY-COMPOSITE-GATEWAY ||--o| DPAY-MERCHANT-APP : Service
    MERCHANT-GET {
        string connectshopsupport "Get ability to manage all stores in one place"
        string connectcrmsoftwaresupport "Get automated processes by dpay IFTE module"
        string globalpaymentsupport "Get receive cross border payment capabilities"
        string cryptocurrencysupport "Get ability to receive cryptocurrency payment"
    }
    DPAY-MERCHANT-APP ||--o| MERCHANT-GET : Provides
    MERCHANT-GET ||--o| COMMODITY-SOURCES : To
    DPAY-COMPOSITE-GATEWAY ||--o| DPAY-MAIN-APP : Service
    DPAY-MAIN-APP ||--o{ DEFAULT-FUNCTION: Provides
    DEFAULT-FUNCTION {
        string defauleteemessager "Secure and safity connection service"
        string compositewallet "Manage all accounts in one place"
        string connectotherapp "Connect to dpay bridge support app and automated processes by IFTE module"
        string localfiatloan
        string localfiattransfer
        string localfiatpayment
    }
    DEFAULT-FUNCTION ||--o| COMMODITY-SOURCES : To
    DEFAULT-FUNCTION ||--o| FUNDING-SOURCES : To
    DEFAULT-FUNCTION ||--o| CUSTOMER : To
    SUPPLIER-SUPPORT-FUNCTION {
        bool crossbordertransfer "If Supplier Support"
        bool crossborderpayment "If Supplier Support"
        bool cryptocurrencyloan "If Supplier Support"
        bool cryptocurrencyexchange "If Supplier Support"
        bool cryptocurrencypayment "If Supplier Support"
    }
    DPAY-SUPPLIER-APP ||--o{ SUPPLIER-SUPPORT-FUNCTION: Provides
    SUPPLIER-SUPPORT-FUNCTION ||--o| CUSTOMER : To
    CUSTOMER ||--o| LOAN-NEEDS : Produce
    CUSTOMER ||--o| TRANSFER-NEEDS : Produce
    CUSTOMER ||--o| SHOPPING-NEEDS : Produce
    SHOPPING-NEEDS ||--o| PAYMENT-NEEDS : Produce
    SHOPPING-NEEDS ||--o| DPAY-MERCHANT-APP : Request
    PAYMENT-NEEDS ||--o| DPAY-SUPPLIER-APP : Request
    LOAN-NEEDS ||--o| DPAY-SUPPLIER-APP : Request
    TRANSFER-NEEDS ||--o| DPAY-SUPPLIER-APP : Request`,
    'System structure': `C4Context
  Node(stru, "DPay Payment System Full Stack Structure", "Front End, Middle Layer, Back End"){
    System(fron, "Front:Micro Application", "微前端是技术栈无关,前后端可独立开发的方案,旨在解决企业级应用中常见的维护问题")
    System(midd, "Middle:API Gateway", "支持亚毫秒级性能,混合或多云基础架构以及高扩展性")
    System(back, "Back:Micro Service", "每个微服务只关注一个业务功能,独立运行在不同的进程中,可由不同的编程语言开发")
  }
  Node("role", "Roles", "Supplier, Merchant, Customer, Composite"){
    Person(rosu, "Supplier", "")
    Person(rome, "Merchant", "")
    Person(rocu, "Customer", "")   
    Person_Ext(roco, "Composite", "")
  }
  Boundary(main, "DPay Front Main App", "React And Qiankun Framework") {
    Component_Ext(cptm, "Cryptocurrency Module", "")
    ComponentDb_Ext(fedb, "Non Sensitive Data", "", "")
    Component_Ext(crtm, "Cross Border Module", "")
    Component(iftm, "Auto Process Module", "")
    Component(layo, "Normal UI Components", "")
    Component(logi, "SSO Auth Module", "")
    Component(adui, "Admin UI Components", "")
    Node(wlta, "Wallet App", "Vue Framework") {
      Component(fiat, "Basic Fiat Module")  
      Component_Ext(cryc, "Crypto service Module", "")        
    }
    Node(msge, "Messager App", "React Framework") {
        Component(chat, "ETEE Chat Module")  
        Component(brdg, "Bridge Connect Module", "")        
    }
    Node(srca, "Search App", "Svelte Framework") {
        Component(nors, "Basic Search Module")  
        Component_Ext(dapp, "Dapp Service Module", "")        
    }
    Node(srap, "Supplier Admin App", "React Framework") {
        Component(scnt, "Supplier Connect Management", "")
        ComponentDb_Ext(sndb, "Non Sensitive Data", "", "")
        Boundary(sdfl, "Default Support", "At Least One") {
          Component(lomm, "Loan Service Management Module", "")
          Component(tron, "Transfer Service Management Module", "")
          Component(payt, "Payment Service Management Module", "")
        }
        Boundary(sopl, "Optional Support", "Non Essential") {
          Component_Ext(scbd, "Cross Border Management Module", "", "")
          Component_Ext(sccs, "Crypto Service Management Module", "", "")
        }
    }
    Node(mrt, "Merchant Admin App", "Vue Framework") {
      Component(shpm, "Store Management Module", "")
      Component(mprm, "Payment Management Module", "")
      Component(invm, "Invoice Management Module", "")
      ComponentDb_Ext(mndb, "Non Sensitive Data", "", "")
      Boundary(mopl, "Optional Support", "Non Essential") {
        Component_Ext(mcbd, "Cross Border Recive Module", "", "")
        Component_Ext(mccs, "Cryptocurrency Recive Module", "", "")
      }
    }
  }
  Boundary(midd, "DPay Back End Service") {
    Deployment_Node(gapi, "Common Module Api") {
      System(auth, "User authentication")
      System(ccum, "Account management")
      System(lcfm, "Local fiat service")
      System(mgti, "Messaging service")
      System(bgsi, "Bridge service")
      System(sesi, "Basic search service")
      System(rcni, "Rate conversion")    
    }
    Deployment_Node(sapi, "Supplier Dedicated Api") {
      System(saum, "Supplier Account Management")
      System(slcm, "Customer Management Module")
      System(slsm, "External connect management")
      System_Ext(scbm, "Cross Border Management")
      System_Ext(sccm, "Cryptocurrency Management")     
    }
    Deployment_Node(mapi, "Merchant Dedicated Api") {
      System(maum, "Merchant Account Management")
      System(mlsm, "Merchant External connect management")
      System(mlcm, "Merchant Customer Management Module")
      System_Ext(mcbm, "Merchant Cross Border Management")
      System_Ext(mccm, "Merchant Cryptocurrency Management")    
    }
  }
`,
		'User Login': `C4Context
  Node("role", "Roles", "Supplier, Merchant, Customer, Composite"){
    Person(rosu, "Supplier", "")
    Person(rome, "Merchant", "")
    Person(rocu, "Customer", "")   
    Person_Ext(roco, "Composite", "")
  }
  Boundary(main, "DPay Front Main App", "React And Qiankun Framework") {
    Component_Ext(cptm, "Cryptocurrency Module", "")
    ComponentDb_Ext(fedb, "Non Sensitive Data", "", "")
    Component_Ext(crtm, "Cross Border Module", "")
    Component(iftm, "Auto Process Module", "")
    Component(adui, "Admin UI Components", "")
    Component(logi, "SSO Auth Module", "")
    Component(layo, "Normal UI Components", "")
    Node(wlta, "Wallet App", "Vue Framework") {
      Component(fiat, "Basic Fiat Module")  
      Component_Ext(cryc, "Crypto service Module", "")        
    }
    Node(msge, "Messager App", "React Framework") {
        Component(chat, "ETEE Chat Module")  
        Component(brdg, "Bridge Connect Module", "")        
    }
    Node(srca, "Search App", "Svelte Framework") {
        Component(nors, "Basic Search Module")  
        Component_Ext(dapp, "Dapp Service Module", "")        
    }
    Node(srap, "Supplier Admin App", "React Framework") {
        Component(scnt, "Supplier Connect Management", "")
        ComponentDb_Ext(sndb, "Non Sensitive Data", "", "")
        Boundary(sdfl, "Default Support", "At Least One") {
          Component(lomm, "Loan Service Management Module", "")
          Component(tron, "Transfer Service Management Module", "")
          Component(payt, "Payment Service Management Module", "")
        }
        Boundary(sopl, "Optional Support", "Non Essential") {
          Component_Ext(scbd, "Cross Border Management Module", "", "")
          Component_Ext(sccs, "Crypto Service Management Module", "", "")
        }
    }
    Node(mrt, "Merchant Admin App", "Vue Framework") {
      Component(shpm, "Store Management Module", "")
      Component(mprm, "Payment Management Module", "")
      Component(invm, "Invoice Management Module", "")
      ComponentDb_Ext(mndb, "Non Sensitive Data", "", "")
      Boundary(mopl, "Optional Support", "Non Essential") {
        Component_Ext(mcbd, "Cross Border Recive Module", "", "")
        Component_Ext(mccs, "Cryptocurrency Recive Module", "", "")
      }
    }
  }
  Boundary(midd, "DPay Back End Service") {
    Deployment_Node(gapi, "Common Module Api") {
      System(auth, "User authentication")
      System(ccum, "Account management")
      System(lcfm, "Local fiat service")
      System(mgti, "Messaging service")
      System(bgsi, "Bridge service")
      System(sesi, "Basic search service")
      System(rcni, "Rate conversion")    
    }
    Deployment_Node(sapi, "Supplier Dedicated Api") {
      System(saum, "Supplier Account Management")
      System(slcm, "Customer Management Module")
      System(slsm, "External connect management")
      System_Ext(scbm, "Cross Border Management")
      System_Ext(sccm, "Cryptocurrency Management")     
    }
    Deployment_Node(mapi, "Merchant Dedicated Api") {
      System(maum, "Merchant Account Management")
      System(mlsm, "Merchant External connect management")
      System(mlcm, "Merchant Customer Management Module")
      System_Ext(mcbm, "Merchant Cross Border Management")
      System_Ext(mccm, "Merchant Cryptocurrency Management")    
    }
  }
  Rel(rocu, logi, "Login", "HTTPS")
  UpdateRelStyle(rocu, logi, $textColor="blue", $lineColor="blue")
  BiRel(logi, auth, "Request")
  UpdateRelStyle(logi, auth, $textColor="blue", $lineColor="blue", $offsetX="100", $offsetY="20")
  Rel(auth, ccum, "")
  UpdateRelStyle(auth, ccum, $textColor="blue", $lineColor="blue")
  Rel(ccum, lcfm, "")
  UpdateRelStyle(ccum, lcfm, $textColor="blue", $lineColor="blue")
  Rel(lcfm, mgti, "")
  UpdateRelStyle(ccum, mgti, $textColor="blue", $lineColor="blue")
  Rel(mgti, bgsi, "")
  UpdateRelStyle(ccum, bgsi, $textColor="blue", $lineColor="blue")
  Rel(bgsi, sesi, "")
  UpdateRelStyle(ccum, sesi, $textColor="blue", $lineColor="blue")
  BiRel(lcfm, fiat, "Connect")
  BiRel(mgti, chat, "Connect")
  BiRel(bgsi, brdg, "Connect")
  BiRel(sesi, nors, "Connect")
  UpdateRelStyle(sesi, nors, $offsetX="100", $offsetY="20")
  BiRel(fiat, layo, "Render")
  UpdateRelStyle(fiat, layo, $textColor="#ff9800", $lineColor="#ff9800", $offsetY="-40")
  UpdateLayoutConfig($c4ShapeInRow="1", $c4BoundaryInRow="3")
            `,
		'Supplier Login': `C4Context
  Node("role", "Roles", "Supplier, Merchant, Customer, Composite"){
    Person(rosu, "Supplier", "")
    Person(rome, "Merchant", "")
    Person(rocu, "Customer", "")   
    Person_Ext(roco, "Composite", "")
  }
  Boundary(main, "DPay Front Main App", "React And Qiankun Framework") {
    Component_Ext(cptm, "Cryptocurrency Module", "")
    ComponentDb_Ext(fedb, "Non Sensitive Data", "", "")
    Component_Ext(crtm, "Cross Border Module", "")
    Component(iftm, "Auto Process Module", "")
    Component(layo, "Normal UI Components", "")
    Component(logi, "SSO Auth Module", "")
    Component(adui, "Admin UI Components", "")
    Node(wlta, "Wallet App", "Vue Framework") {
      Component(fiat, "Basic Fiat Module")  
      Component_Ext(cryc, "Crypto service Module", "")        
    }
    Node(msge, "Messager App", "React Framework") {
        Component(chat, "ETEE Chat Module")  
        Component(brdg, "Bridge Connect Module", "")        
    }
    Node(srca, "Search App", "Svelte Framework") {
        Component(nors, "Basic Search Module")  
        Component_Ext(dapp, "Dapp Service Module", "")        
    }
    Node(srap, "Supplier Admin App", "React Framework") {
        Component(scnt, "Supplier Connect Management", "")
        ComponentDb_Ext(sndb, "Non Sensitive Data", "", "")
        Boundary(sdfl, "Default Support", "At Least One") {
          Component(lomm, "Loan Service Management Module", "")
          Component(tron, "Transfer Service Management Module", "")
          Component(payt, "Payment Service Management Module", "")
        }
        Boundary(sopl, "Optional Support", "Non Essential") {
          Component_Ext(scbd, "Cross Border Management Module", "", "")
          Component_Ext(sccs, "Crypto Service Management Module", "", "")
        }
    }
    Node(mrt, "Merchant Admin App", "Vue Framework") {
      Component(shpm, "Store Management Module", "")
      Component(mprm, "Payment Management Module", "")
      Component(invm, "Invoice Management Module", "")
      ComponentDb_Ext(mndb, "Non Sensitive Data", "", "")
      Boundary(mopl, "Optional Support", "Non Essential") {
        Component_Ext(mcbd, "Cross Border Recive Module", "", "")
        Component_Ext(mccs, "Cryptocurrency Recive Module", "", "")
      }
    }
  }
  Boundary(midd, "DPay Back End Service") {
    Deployment_Node(gapi, "Common Module Api") {
      System(auth, "User authentication")
      System(ccum, "Account management")
      System(lcfm, "Local fiat service")
      System(mgti, "Messaging service")
      System(bgsi, "Bridge service")
      System(sesi, "Basic search service")
      System(rcni, "Rate conversion")    
    }
    Deployment_Node(sapi, "Supplier Dedicated Api") {
      System(saum, "Supplier Account Management")
      System(slcm, "Customer Management Module")
      System(slsm, "External connect management")
      System_Ext(scbm, "Cross Border Management")
      System_Ext(sccm, "Cryptocurrency Management")     
    }
    Deployment_Node(mapi, "Merchant Dedicated Api") {
      System(maum, "Merchant Account Management")
      System(mlsm, "Merchant External connect management")
      System(mlcm, "Merchant Customer Management Module")
      System_Ext(mcbm, "Merchant Cross Border Management")
      System_Ext(mccm, "Merchant Cryptocurrency Management")    
    }
  }
  Rel(rosu, logi, "Login", "HTTPS")
  UpdateRelStyle(rosu, logi, $textColor="blue", $lineColor="blue", $offsetX="20")
  BiRel(logi, auth, "Request")
  UpdateRelStyle(logi, auth, $textColor="blue", $lineColor="blue", $offsetY="-60")
  Rel(auth, saum, "")
  UpdateRelStyle(auth, saum, $textColor="blue", $lineColor="blue")
  Rel(saum, slcm, "")
  UpdateRelStyle(saum, slcm, $textColor="blue", $lineColor="blue")
  Rel(slcm, slsm, "")
  UpdateRelStyle(slcm, slsm, $textColor="blue", $lineColor="blue")
  BiRel(slcm, lomm, "Connect")
  UpdateRelStyle(slcm, lomm, $offsetX="70", $offsetY="80")
  BiRel(slcm, tron, "Connect")
  UpdateRelStyle(slcm, tron, $offsetX="70", $offsetY="80")
  BiRel(slcm, payt, "Connect")
  UpdateRelStyle(slcm, payt, $offsetX="70", $offsetY="100")
  BiRel(slsm, scnt, "Connect")
  UpdateRelStyle(slsm, scnt, $offsetX="70", $offsetY="60")
  BiRel(lomm, adui, "Render")
  UpdateRelStyle(lomm, adui, $textColor="#ff9800", $lineColor="#ff9800", $offsetX="30", $offsetY="100")
  UpdateLayoutConfig($c4ShapeInRow="1", $c4BoundaryInRow="3")
            `,
		'Merchant Login': `C4Context
  Node("role", "Roles", "Supplier, Merchant, Customer, Composite"){
    Person(rosu, "Supplier", "")
    Person(rome, "Merchant", "")
    Person(rocu, "Customer", "")   
    Person_Ext(roco, "Composite", "")
  }
  Boundary(main, "DPay Front Main App", "React And Qiankun Framework") {
    Component_Ext(cptm, "Cryptocurrency Module", "")
    ComponentDb_Ext(fedb, "Non Sensitive Data", "", "")
    Component_Ext(crtm, "Cross Border Module", "")
    Component(iftm, "Auto Process Module", "")
    Component(layo, "Normal UI Components", "")
    Component(logi, "SSO Auth Module", "")
    Component(adui, "Admin UI Components", "")
    Node(wlta, "Wallet App", "Vue Framework") {
      Component(fiat, "Basic Fiat Module")  
      Component_Ext(cryc, "Crypto service Module", "")        
    }
    Node(msge, "Messager App", "React Framework") {
        Component(chat, "ETEE Chat Module")  
        Component(brdg, "Bridge Connect Module", "")        
    }
    Node(srca, "Search App", "Svelte Framework") {
        Component(nors, "Basic Search Module")  
        Component_Ext(dapp, "Dapp Service Module", "")        
    }
    Node(srap, "Supplier Admin App", "React Framework") {
        Component(scnt, "Supplier Connect Management", "")
        ComponentDb_Ext(sndb, "Non Sensitive Data", "", "")
        Boundary(sdfl, "Default Support", "At Least One") {
          Component(lomm, "Loan Service Management Module", "")
          Component(tron, "Transfer Service Management Module", "")
          Component(payt, "Payment Service Management Module", "")
        }
        Boundary(sopl, "Optional Support", "Non Essential") {
          Component_Ext(scbd, "Cross Border Management Module", "", "")
          Component_Ext(sccs, "Crypto Service Management Module", "", "")
        }
    }
    Node(mrt, "Merchant Admin App", "Vue Framework") {
      Component(shpm, "Store Management Module", "")
      Component(mprm, "Payment Management Module", "")
      Component(invm, "Invoice Management Module", "")
      ComponentDb_Ext(mndb, "Non Sensitive Data", "", "")
      Boundary(mopl, "Optional Support", "Non Essential") {
        Component_Ext(mcbd, "Cross Border Recive Module", "", "")
        Component_Ext(mccs, "Cryptocurrency Recive Module", "", "")
      }
    }
  }
  Boundary(midd, "DPay Back End Service") {
    Deployment_Node(gapi, "Common Module Api") {
      System(auth, "User authentication")
      System(ccum, "Account management")
      System(lcfm, "Local fiat service")
      System(mgti, "Messaging service")
      System(bgsi, "Bridge service")
      System(sesi, "Basic search service")
      System(rcni, "Rate conversion")    
    }
    Deployment_Node(sapi, "Supplier Dedicated Api") {
      System(saum, "Supplier Account Management")
      System(slcm, "Customer Management Module")
      System(slsm, "External connect management")
      System_Ext(scbm, "Cross Border Management")
      System_Ext(sccm, "Cryptocurrency Management")     
    }
    Deployment_Node(mapi, "Merchant Dedicated Api") {
      System(maum, "Merchant Account Management")
      System(mlsm, "Merchant External connect management")
      System(mlcm, "Merchant Customer Management Module")
      System_Ext(mcbm, "Merchant Cross Border Management")
      System_Ext(mccm, "Merchant Cryptocurrency Management")    
    }
  }
  Rel(rome, logi, "Login", "HTTPS")
  UpdateRelStyle(rome, logi, $textColor="blue", $lineColor="blue", $offsetX="20")
  BiRel(logi, auth, "Request")
  UpdateRelStyle(logi, auth, $textColor="blue", $lineColor="blue", $offsetY="-60")
  Rel(auth, maum, "")
  UpdateRelStyle(auth, maum, $textColor="blue", $lineColor="blue")
  Rel(maum, mlsm, "")
  UpdateRelStyle(maum, mlsm, $textColor="blue", $lineColor="blue")
  Rel(mlsm, mlcm, "")
  UpdateRelStyle(mlsm, mlcm, $textColor="blue", $lineColor="blue")
  BiRel(mlsm, shpm, "Connect")
  UpdateRelStyle(mlsm, shpm, $offsetX="90", $offsetY="80")
  BiRel(mlcm, mprm, "Connect")
  UpdateRelStyle(mlcm, mprm, $offsetX="90", $offsetY="80")
  BiRel(mlcm, invm, "Connect")
  UpdateRelStyle(mlcm, invm, $offsetX="90", $offsetY="100")
  BiRel(shpm, adui, "Render")
  UpdateRelStyle(shpm, adui, $textColor="#ff9800", $lineColor="#ff9800", $offsetX="230", $offsetY="200")
  UpdateLayoutConfig($c4ShapeInRow="1", $c4BoundaryInRow="3")
            `/*,
		'C4 Deployment': `C4Deployment
    title Deployment Diagram for Internet Banking System - Live

    Deployment_Node(mob, "Customer's mobile device", "Apple IOS or Android"){
        Container(mobile, "Mobile App", "Xamarin", "Provides a limited subset of the Internet Banking functionality to customers via their mobile device.")
    }

    Deployment_Node(comp, "Customer's computer", "Mircosoft Windows or Apple macOS"){
        Deployment_Node(browser, "Web Browser", "Google Chrome, Mozilla Firefox,<br/> Apple Safari or Microsoft Edge"){
            Container(spa, "Single Page Application", "JavaScript and Angular", "Provides all of the Internet Banking functionality to customers via their web browser.")
        }
    }

    Deployment_Node(plc, "Big Bank plc", "Big Bank plc data center"){
        Deployment_Node(dn, "bigbank-api*** x8", "Ubuntu 16.04 LTS"){
            Deployment_Node(apache, "Apache Tomcat", "Apache Tomcat 8.x"){
                Container(api, "API Application", "Java and Spring MVC", "Provides Internet Banking functionality via a JSON/HTTPS API.")
            }
        }
        Deployment_Node(bb2, "bigbank-web*** x4", "Ubuntu 16.04 LTS"){
            Deployment_Node(apache2, "Apache Tomcat", "Apache Tomcat 8.x"){
                Container(web, "Web Application", "Java and Spring MVC", "Delivers the static content and the Internet Banking single page application.")
            }
        }
        Deployment_Node(bigbankdb01, "bigbank-db01", "Ubuntu 16.04 LTS"){
            Deployment_Node(oracle, "Oracle - Primary", "Oracle 12c"){
                ContainerDb(db, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
            }
        }
        Deployment_Node(bigbankdb02, "bigbank-db02", "Ubuntu 16.04 LTS") {
            Deployment_Node(oracle2, "Oracle - Secondary", "Oracle 12c") {
                ContainerDb(db2, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
            }
        }
    }

    Rel(mobile, api, "Makes API calls to", "json/HTTPS")
    Rel(spa, api, "Makes API calls to", "json/HTTPS")
    Rel_U(web, spa, "Delivers to the customer's web browser")
    Rel(api, db, "Reads from and writes to", "JDBC")
    Rel(api, db2, "Reads from and writes to", "JDBC")
    Rel_R(db, db2, "Replicates data to")

    UpdateRelStyle(spa, api, $offsetY="-40")
    UpdateRelStyle(web, spa, $offsetY="-40")
    UpdateRelStyle(api, db, $offsetY="-20", $offsetX="5")
    UpdateRelStyle(api, db2, $offsetX="-40", $offsetY="-20")
    UpdateRelStyle(db, db2, $offsetY="-10")
            `,
		'C4 Component': `C4Component
    title Component diagram for Internet Banking System - API Application

    Container(spa, "Single Page Application", "javascript and angular", "Provides all the internet banking functionality to customers via their web browser.")
    Container(ma, "Mobile App", "Xamarin", "Provides a limited subset ot the internet banking functionality to customers via their mobile mobile device.")
    ContainerDb(db, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
    System_Ext(mbs, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

    Container_Boundary(api, "API Application") {
        Component(sign, "Sign In Controller", "MVC Rest Controlle", "Allows users to sign in to the internet banking system")
        Component(accounts, "Accounts Summary Controller", "MVC Rest Controller", "Provides customers with a summary of their bank accounts")
        Component(security, "Security Component", "Spring Bean", "Provides functionality related to singing in, changing passwords, etc.")
        Component(mbsfacade, "Mainframe Banking System Facade", "Spring Bean", "A facade onto the mainframe banking system.")

        Rel(sign, security, "Uses")
        Rel(accounts, mbsfacade, "Uses")
        Rel(security, db, "Read & write to", "JDBC")
        Rel(mbsfacade, mbs, "Uses", "XML/HTTPS")
    }

    Rel_Back(spa, sign, "Uses", "JSON/HTTPS")
    Rel(spa, accounts, "Uses", "JSON/HTTPS")

    Rel(ma, sign, "Uses", "JSON/HTTPS")
    Rel(ma, accounts, "Uses", "JSON/HTTPS")

    UpdateRelStyle(spa, sign, $offsetY="-40") 
    UpdateRelStyle(spa, accounts, $offsetX="40", $offsetY="40")

    UpdateRelStyle(ma, sign, $offsetX="-90", $offsetY="40")
    UpdateRelStyle(ma, accounts, $offsetY="-40")

        UpdateRelStyle(sign, security, $offsetX="-160", $offsetY="10")
        UpdateRelStyle(accounts, mbsfacade, $offsetX="140", $offsetY="10")
        UpdateRelStyle(security, db, $offsetY="-40")
        UpdateRelStyle(mbsfacade, mbs, $offsetY="-40")
      `*/
	};
  
	const loadSampleDiagram = (diagramType: string): void => {
		updateCode(samples[diagramType], {
			updateDiagram: true,
			updateEditor: true
		});
	};
</script>

<Card title="Selector" isOpen={true}>
	<div class="flex gap-2 flex-wrap p-2">
		{#each Object.keys(samples) as sample}
			<button class="btn btn-primary normal-case btn-sm" on:click={() => loadSampleDiagram(sample)}
				>{sample}</button>
		{/each}
	</div>
</Card>
