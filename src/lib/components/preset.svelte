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
  Node(structure, "DPay Payment System Full Stack Structure", "Front End, Middle Layer, Back End"){
    Container(front, "Micro Application", "React and Vue", "")
    Container(middle, "API Gateway", "Kong by Lua", "")
    Container(back, "Micro Service", "NodeJs Go Postgresql", "")
  }
  Deployment_Node("role", "Roles", "Supplier, Merchant, Customer, Composite"){
    Person(roleSU, "Supplier", "")
    Person(roleME, "Merchant", "")
    Person(roleCU, "Customer", "")   
    Person_Ext(roleCO, "Composite", "")
  }
  Enterprise_Boundary(b0, "BankBoundary0") {
    System(SystemAA, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")  
    Enterprise_Boundary(b1, "BankBoundary") {
      SystemDb_Ext(SystemE, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")      
      System_Boundary(b2, "BankBoundary2") {  
        System(SystemA, "Banking System A")  
        System(SystemB, "Banking System B", "A system of the bank, with personal bank accounts. next line.")        
      } 
      System_Ext(SystemC, "E-mail system", "The internal Microsoft Exchange e-mail system.") 
      SystemDb(SystemD, "Banking System D Database", "A system of the bank, with personal bank accounts.") 
      Boundary(b3, "BankBoundary3", "boundary") {  
        SystemQueue(SystemF, "Banking System F Queue", "A system of the bank.")        
        SystemQueue_Ext(SystemG, "Banking System G Queue", "A system of the bank, with personal bank accounts.") 
      }
    }
  }
  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
`/*,
		'Flow Chart': `graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A
        od>Odd shape]-- Two line<br/>edge comment --> ro
        di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --> od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange
     E[Square Rect] -- Link text --> F((Circle))
     E --> G(Round Rect)
     F --> H{Rhombus}
     G --> H`,
		'Sequence Diagram': `sequenceDiagram
    participant web as Web Browser
    participant blog as Blog Service
    participant account as Account Service
    participant mail as Mail Service
    participant db as Storage

    Note over web,db: The user must be logged in to submit blog posts
    web->>+account: Logs in using credentials
    account->>db: Query stored accounts
    db->>account: Respond with query result

    alt Credentials not found
        account->>web: Invalid credentials
    else Credentials found
        account->>-web: Successfully logged in

        Note over web,db: When the user is authenticated, they can now submit new posts
        web->>+blog: Submit new post
        blog->>db: Store post data

        par Notifications
            blog--)mail: Send mail to blog subscribers
            blog--)db: Store in-site notifications
        and Response
            blog-->>-web: Successfully posted
        end
    end
            `,
		'Class Diagram': `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }
            `,
		'State Diagram': `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
            `,
		'C4 Container': `C4Container
    title Container diagram for Internet Banking System

    System_Ext(email_system, "E-Mail System", "The internal Microsoft Exchange system", $tags="v1.0")
    Person(customer, Customer, "A customer of the bank, with personal bank accounts", $tags="v1.0")

    Container_Boundary(c1, "Internet Banking") {
        Container(spa, "Single-Page App", "JavaScript, Angular", "Provides all the Internet banking functionality to cutomers via their web browser")
        Container_Ext(mobile_app, "Mobile App", "C#, Xamarin", "Provides a limited subset of the Internet banking functionality to customers via their mobile device")
        Container(web_app, "Web Application", "Java, Spring MVC", "Delivers the static content and the Internet banking SPA")
        ContainerDb(database, "Database", "SQL Database", "Stores user registration information, hashed auth credentials, access logs, etc.")
        ContainerDb_Ext(backend_api, "API Application", "Java, Docker Container", "Provides Internet banking functionality via API")

    }

    System_Ext(banking_system, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

    Rel(customer, web_app, "Uses", "HTTPS")
    UpdateRelStyle(customer, web_app, $offsetY="60", $offsetX="90")     
    Rel(customer, spa, "Uses", "HTTPS")
    UpdateRelStyle(customer, spa, $offsetY="-40")    
    Rel(customer, mobile_app, "Uses")
    UpdateRelStyle(customer, mobile_app, $offsetY="-30") 

    Rel(web_app, spa, "Delivers")
    UpdateRelStyle(web_app, spa, $offsetX="130") 
    Rel(spa, backend_api, "Uses", "async, JSON/HTTPS")
    Rel(mobile_app, backend_api, "Uses", "async, JSON/HTTPS")
    Rel_Back(database, backend_api, "Reads from and writes to", "sync, JDBC")

    Rel(email_system, customer, "Sends e-mails to")
    UpdateRelStyle(email_system, customer, $offsetX="-45")    
    Rel(backend_api, email_system, "Sends e-mails using", "sync, SMTP")
    UpdateRelStyle(backend_api, email_system, $offsetY="-60")    
    Rel(backend_api, banking_system, "Uses", "sync/async, XML/HTTPS")
    UpdateRelStyle(backend_api, banking_system, $offsetY="-50", $offsetX="-140")
            `,
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
