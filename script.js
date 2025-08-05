// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DATOS (Extraída de las imágenes) ---

    // Datos para el Análisis de Antigüedad de Cartera
    const agingData = [
        { range: '0 - 30 Días', count: 224, cost: 205486286},
        { range: '31 - 60 Días', count: 76, cost: 75627042},
        { range: '61 - 90 Días', count: 22, cost: 50373054},
        { range: '> 90 Días', count: 64, cost: 156925493}
    ];

    // Datos para la Distribución por Estado de OT
    const statusData = [
	{ status: 'Listo para Facturar', count: 176, cost: 250179224},
	{ status: 'X Programar', count: 105, cost: 138217885},
	{ status: 'Para Liquidar', count: 47, cost: 69546041},
        { status: 'Documento Creado', count: 40, cost: 18736871},
        { status: 'X Refacturar', count: 9, cost: 10409167},
	{ status: 'X Asignar Coordinador', count: 9, cost: 1322687}
    ];

    // Datos para el Top 15 Clientes con Mayor Tiempo Promedio
    const topClientsData = [
        { client: 'CONCESIONARIA SAN RAFAEL', avgDays: 381 },
        { client: 'CONCESIONARIA VIAL DE LOS ANDES S.A.', avgDays: 216 },
        { client: 'COOPERATIVA COLANTA', avgDays: 174 },
        { client: 'DIAZ VILLARRAGA JOSE LUIS', avgDays: 307 },
        { client: 'ENTREGA DE CARGA S A', avgDays: 147 },
        { client: 'ESE HOSPITAL SAN RAFAEL DE G', avgDays: 139 },
        { client: 'HERNANDEZ ORTIZ JORGE ALEIXEN', avgDays: 237 },
        { client: 'LINARES RODRIGUEZ LUCAS ORLANDO', avgDays: 338 },
        { client: 'MINCIVIL S A', avgDays: 445 },
        { client: 'SOCIEDAD DE ACUEDUCTO ALCANTARILLADO Y ASEO', avgDays: 184 },
        { client: 'TRANSPORTES VIGIA SAS', avgDays: 154 }
    ];
    
    // Datos para las 20 OTs con mayor tiempo abiertas
    const oldestOtsData = [
        { ot: 'OT-CUMED-8756', client: 'C I BANACOL SA', daysOpen: 573, cost: 238992 },
        { ot: 'OT-CUIBG-3658', client: 'ENTREGA DE CARGA S A', daysOpen: 445, cost: 333371 },
        { ot: 'OT-CUIBG-3765', client: 'TRANSPORTES ICEBERG DE COLOMBIA SA', daysOpen: 408, cost: 407862 },
        { ot: 'OT-CUMED-10341', client: 'AGUDELO TORRES LUIS EMIGDIO', daysOpen: 381, cost: 0 },
        { ot: 'OT-GFBTA-24388', client: 'TRANSPORTES VIGIA SAS', daysOpen: 364, cost: 522399 },
        { ot: 'OT-CUIBG-3946', client: 'ICOLTRANS SAS', daysOpen: 357, cost: 0 },
        { ot: 'OT-CUIBG-4004', client: 'DIAZ VILLARRAGA JOSE LUIS', daysOpen: 338, cost: 145922 },
        { ot: 'OT-CUBTA-16312', client: 'AEROVIAS DEL CONTINENTE AMERICANO S A AVIANCA', daysOpen: 292, cost: 4642960 },
        { ot: 'OT-GFBTA-26249', client: 'HALLIBURTON LATIN AMERICA S R L SUCURSAL COLOMBIA', daysOpen: 251, cost: 2284080 },
        { ot: 'OT-GFBQL-1499', client: 'COOPERATIVA COLANTA', daysOpen: 237, cost: 331558 },
        { ot: 'OT-CUIBG-4355', client: 'AGREGADOS TETUAN SAS', daysOpen: 236, cost: 599440 },
        { ot: 'OT-CUMED-11429', client: 'T D M TRANSPORTES S A S', daysOpen: 234, cost: 5255437 },
        { ot: 'OT-CUIBG-4403', client: 'AGREGADOS TETUAN SAS', daysOpen: 219, cost: 616800 },
        { ot: 'OT-GFBTA-26769', client: 'TRANSPORTES VIGIA SAS', daysOpen: 219, cost: 960000 },
        { ot: 'OT-GFBTA-26792', client: 'TRANSPORTES VIGIA SAS', daysOpen: 217, cost: 329150 },
        { ot: 'OT-GFBQL-1533', client: 'ARINTIA GROUP S.A.S.', daysOpen: 216, cost: 546801 },
        { ot: 'OT-CUBTA-17300', client: 'TREVIGALANTE S.A.', daysOpen: 213, cost: 62609181 },
        { ot: 'OT-GFBTA-26983', client: 'HALLIBURTON LATIN AMERICA S R L SUCURSAL COLOMBIA', daysOpen: 206, cost: 3539748 },
        { ot: 'OT-GFBTA-27147', client: 'SOCIEDAD DE ACUEDUCTO ALCANTARILLADO Y ASEO', daysOpen: 194, cost: 1031461 },
        { ot: 'OT-GFBTA-27286', client: 'LAP TECHNOLOGIES S.A', daysOpen: 187, cost: 3315507 }
    ];

    // --- FUNCIONES DE RENDERIZADO ---

    // Función para formatear números como moneda (COP)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
    };

    // Función para renderizar el análisis de antigüedad con barras de progreso
    const renderAgingAnalysis = () => {
        const container = document.getElementById('aging-analysis-container');
        const totalCount = agingData.reduce((sum, item) => sum + item.count, 0);
        
        let html = '';
        agingData.forEach(item => {
            const percentage = (item.count / totalCount * 100).toFixed(1);
            html += `
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="progress-bar-label">${item.range} (${item.count} OTs)</span>
                        <span class="cost-value">${formatCurrency(item.cost)}</span>
                    </div>
                    <div class="progress" role="progressbar" aria-label="${item.range}" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: ${percentage}%">${percentage}%</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    };

    // Función para renderizar la distribución por estado en una tabla
    const renderStatusDistribution = () => {
        const container = document.getElementById('status-distribution-container');
        let tableHtml = `
            <table class="table table-sm table-borderless">
                <thead>
                    <tr>
                        <th>Estado</th>
                        <th class="text-end">Cantidad</th>
                        <th class="text-end">Costo Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
        statusData.forEach(item => {
            tableHtml += `
                <tr>
                    <td>${item.status}</td>
                    <td class="text-end">${item.count.toLocaleString('es-CO')}</td>
                    <td class="text-end cost-value">${formatCurrency(item.cost)}</td>
                </tr>
            `;
        });
        tableHtml += '</tbody></table>';
        container.innerHTML = tableHtml;
    };

    // Función para renderizar la tabla de Top Clientes
    const renderTopClients = () => {
        const container = document.getElementById('top-clients-container');
        let tableHtml = `
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre del Cliente</th>
                        <th class="text-center">Días Prom.</th>
                    </tr>
                </thead>
                <tbody>
        `;
        topClientsData.forEach((item, index) => {
            tableHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.client}</td>
                    <td class="text-center days-value">${item.avgDays}</td>
                </tr>
            `;
        });
        tableHtml += '</tbody></table>';
        container.innerHTML = tableHtml;
    };

    // Función para renderizar la tabla de OTs más antiguas
    const renderOldestOts = () => {
        const container = document.getElementById('oldest-ots-container');
        let tableHtml = `
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Orden (OT)</th>
                        <th>Cliente</th>
                        <th class="text-center">Días Abierta</th>
                        <th class="text-end">Costo</th>
                    </tr>
                </thead>
                <tbody>
        `;
        oldestOtsData.forEach(item => {
            tableHtml += `
                <tr>
                    <td>${item.ot}</td>
                    <td>${item.client}</td>
                    <td class="text-center days-value">${item.daysOpen}</td>
                    <td class="text-end cost-value">${formatCurrency(item.cost)}</td>
                </tr>
            `;
        });
        tableHtml += '</tbody></table>';
        container.innerHTML = tableHtml;
    };


    // --- EJECUCIÓN ---
    // Se llama a todas las funciones para poblar el dashboard.
    // Usamos un pequeño retraso para simular la carga y que se vea el spinner.
    setTimeout(() => {
        renderAgingAnalysis();
        renderStatusDistribution();
        renderTopClients();
        renderOldestOts();
    }, 500); // 0.5 segundos de retraso
});