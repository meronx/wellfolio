'use strict';

/* ══════════════════════════════════════════════════════════════
   i18n Translations
══════════════════════════════════════════════════════════════ */
const i18nData = {
  'en-US': {
    'nav.dashboard':'Dashboard','nav.holdings':'Holdings','nav.transactions':'Transactions',
    'nav.dividends':'Dividends','nav.analytics':'Analytics','nav.settings':'Settings',
    'metric.total_value':'Total Portfolio Value','metric.unrealized':'Unrealized Gain / Loss',
    'metric.day_change':'Day Change','metric.cash':'Cash Balance','metric.available':'Available',
    'metric.realized':'Realized Gain / Loss','metric.dividends':'Total Dividends',
    'metric.interest':'Interest Earned','metric.fees':'Total Fees','metric.invested':'Invested',
    'metric.taxes':'Total Taxes Paid','metric.income':'Net Income (Div + Int)',
    'metric.deposited':'Total Deposited','metric.withdrawn':'Total Withdrawn',
    'metric.div_total':'Total Dividends Received','metric.div_yield':'Dividend Yield on Cost',
    'metric.div_yield_sub':'Total dividends / invested capital',
    'metric.div_pa':'Personal Div. Yield p.a.','metric.div_pa_sub':'Last 12 months / invested capital',
    'metric.div_forecast':'Annual Forecast','metric.div_forecast_sub':'Next 12 months (estimated)',
    'chart.allocation':'Portfolio Allocation','chart.invested':'Invested Capital Over Time',
    'chart.perf':'Portfolio Performance vs Benchmark',
    'chart.recent_txns':'Recent Transactions','chart.annual_div':'Annual Dividends – Year over Year',
    'chart.monthly_div':'Monthly Dividends','chart.type_breakdown':'Transaction Type Breakdown',
    'chart.sector':'Sector Allocation','chart.country':'Country Allocation',
    'section.holdings':'Current Holdings','section.additional':'Additional Info',
    'section.txn_history':'Transaction History','section.div_calendar':'Dividend Calendar',
    'section.upcoming_div':'Upcoming Dividends (next 12 months)','section.settings':'Settings',
    'section.recent_txns':'Recent Transactions',
    'btn.add_txn':'Add Transaction','btn.save':'Save','btn.cancel':'Cancel',
    'btn.save_settings':'Save Settings','btn.refresh':'Refresh Prices',
    'btn.export_csv':'Export CSV','btn.import_csv':'Import CSV',
    'btn.view_all':'View all','btn.refresh_calendar':'Refresh',
    'filter.all_types':'All types','filter.holdings':'Filter holdings…',
    'settings.currency':'Display Currency',
    'settings.currency_desc':'Default currency used when displaying portfolio values.',
    'settings.locale':'Language & Format',
    'settings.locale_desc':'Controls date and number formatting throughout the app.',
    'settings.preview':'Format Preview','settings.preview_desc':'How dates and numbers will appear in the app.',
    'settings.sidebar':'Sidebar','settings.sidebar_desc':'Keep sidebar collapsed by default (icon-only mode).',
    'settings.collapsed':'Collapsed by default','settings.portfolios':'Portfolio Management',
    'settings.portfolios_desc':'Create and manage multiple portfolios. Each portfolio has its own transactions.',
    'settings.new_portfolio':'New Portfolio',
    'modal.add_txn':'Add Transaction','modal.edit_txn':'Edit Transaction',
    'form.type':'Type','form.date':'Date','form.symbol':'Symbol','form.name':'Name',
    'form.qty':'Quantity','form.price':'Price per Share','form.amount':'Amount',
    'form.fees':'Fees / Commission','form.currency':'Currency','form.notes':'Notes',
    'form.notes_placeholder':'Optional notes','form.symbol_placeholder':'e.g. AAPL',
    'form.select_type':'Select type','form.name_placeholder':'Company name',
    'form.split_ratio':'Split Ratio (e.g. 2)','form.div_amount':'Dividend Amount','form.amount_auto':'Amount (auto)',
    'type.buy':'Buy','type.sell':'Sell','type.split':'Split','type.dividend':'Dividend',
    'type.interest':'Interest Earning','type.tax':'Tax','type.withdrawal':'Withdrawal','type.deposit':'Deposit',
    'empty.no_txns':'No transactions yet','empty.no_holdings':'No holdings yet',
    'empty.loading':'Loading…','empty.no_div':'No dividend data found.',
    'empty.no_upcoming':'No upcoming dividends forecasted','empty.no_match':'No holdings match your search.',
    'toast.settings_saved':'Settings saved!','toast.txn_added':'Transaction added!',
    'toast.txn_updated':'Transaction updated!','toast.txn_deleted':'Transaction deleted!',
    'toast.refreshing':'Refreshing prices…','toast.refreshed':'Prices refreshed!',
    'toast.load_error':'Failed to load portfolio data',
    'theme.dark':'Dark mode','theme.light':'Light mode',
    'cal.paid':'Paid (recorded)','cal.yahoo':'Paid (Yahoo Finance)',
    'cal.upcoming':'Upcoming (est.)','cal.forecast':'Forecasted','cal.current':'(current)',
    'tbl.date':'Date','tbl.type':'Type','tbl.symbol':'Symbol','tbl.qty':'Qty / Ratio',
    'tbl.price':'Price','tbl.amount':'Amount','tbl.fees':'Fees','tbl.name':'Name',
    'tbl.per_share':'Per Share','tbl.shares':'Shares','tbl.est_amount':'Est. Amount',
    'tbl.frequency':'Frequency','tbl.avg_cost':'Avg Cost','tbl.current_price':'Current Price',
    'tbl.mkt_value':'Market Value','tbl.unrealized':'Unrealized P&L',
    'tbl.day_change':'Day Change','tbl.weight':'Weight','tbl.actions':'Actions',
    'portfolio.create':'Create Portfolio','portfolio.rename':'Rename','portfolio.delete':'Delete',
    'portfolio.switch':'Switch Portfolio','portfolio.name_placeholder':'Portfolio name',
    'portfolio.cannot_delete':'Cannot delete the last portfolio','portfolio.active':'Active',
    'benchmark.placeholder':'Benchmark (e.g. SPY)','benchmark.label':'Benchmark',
  },
  'en-GB': {},  // falls back to en-US
  'de-DE': {
    'nav.dashboard':'Übersicht','nav.holdings':'Positionen','nav.transactions':'Transaktionen',
    'nav.dividends':'Dividenden','nav.analytics':'Analyse','nav.settings':'Einstellungen',
    'metric.total_value':'Gesamtwert Portfolio','metric.unrealized':'Nicht realisierter G/V',
    'metric.day_change':'Tagesänderung','metric.cash':'Kassenbestand','metric.available':'Verfügbar',
    'metric.realized':'Realisierter G/V','metric.dividends':'Gesamte Dividenden',
    'metric.interest':'Zinserträge','metric.fees':'Gesamte Gebühren','metric.invested':'Investiert',
    'metric.taxes':'Gezahlte Steuern','metric.income':'Nettoeinkommen (Div + Zins)',
    'metric.deposited':'Eingezahlt','metric.withdrawn':'Abgehoben',
    'metric.div_total':'Gesamte Dividenden','metric.div_yield':'Dividendenrendite',
    'metric.div_yield_sub':'Dividenden / investiertes Kapital',
    'metric.div_pa':'Persönl. Divid.-Rendite p.a.','metric.div_pa_sub':'Letzte 12 Monate / investiertes Kapital',
    'metric.div_forecast':'Jahresprognose','metric.div_forecast_sub':'Nächste 12 Monate (geschätzt)',
    'chart.allocation':'Portfolio-Aufteilung','chart.invested':'Investiertes Kapital im Zeitverlauf',
    'chart.perf':'Portfolio-Performance vs Benchmark',
    'chart.recent_txns':'Letzte Transaktionen','chart.annual_div':'Jährliche Dividenden',
    'chart.monthly_div':'Monatliche Dividenden','chart.type_breakdown':'Transaktionsart',
    'chart.sector':'Sektoraufteilung','chart.country':'Länderaufteilung',
    'section.holdings':'Aktuelle Positionen','section.additional':'Weitere Informationen',
    'section.txn_history':'Transaktionsverlauf','section.div_calendar':'Dividendenkalender',
    'section.upcoming_div':'Bevorstehende Dividenden (nächste 12 Monate)','section.settings':'Einstellungen',
    'section.recent_txns':'Letzte Transaktionen',
    'btn.add_txn':'Transaktion hinzufügen','btn.save':'Speichern','btn.cancel':'Abbrechen',
    'btn.save_settings':'Einstellungen speichern','btn.refresh':'Kurse aktualisieren',
    'btn.export_csv':'CSV exportieren','btn.import_csv':'CSV importieren',
    'btn.view_all':'Alle anzeigen','btn.refresh_calendar':'Aktualisieren',
    'filter.all_types':'Alle Arten','filter.holdings':'Positionen filtern…',
    'settings.currency':'Anzeigewährung',
    'settings.currency_desc':'Standardwährung für die Anzeige von Portfoliowerten.',
    'settings.locale':'Sprache & Format','settings.locale_desc':'Steuert Datums- und Zahlenformatierung in der App.',
    'settings.preview':'Formatvorschau','settings.preview_desc':'So werden Datum und Zahlen in der App angezeigt.',
    'settings.sidebar':'Seitenleiste','settings.sidebar_desc':'Seitenleiste standardmäßig eingeklappt.',
    'settings.collapsed':'Standardmäßig eingeklappt','settings.portfolios':'Portfolio-Verwaltung',
    'settings.portfolios_desc':'Erstellen und verwalten Sie mehrere Portfolios.',
    'settings.new_portfolio':'Neues Portfolio',
    'modal.add_txn':'Transaktion hinzufügen','modal.edit_txn':'Transaktion bearbeiten',
    'form.type':'Art','form.date':'Datum','form.symbol':'Symbol','form.name':'Name',
    'form.qty':'Menge','form.price':'Preis pro Aktie','form.amount':'Betrag',
    'form.fees':'Gebühren / Provision','form.currency':'Währung','form.notes':'Notizen',
    'form.notes_placeholder':'Optionale Notizen','form.symbol_placeholder':'z.B. AAPL',
    'form.select_type':'Art wählen','form.name_placeholder':'Unternehmensname',
    'form.split_ratio':'Split-Verhältnis (z.B. 2)','form.div_amount':'Dividendenbetrag','form.amount_auto':'Betrag (auto)',
    'type.buy':'Kauf','type.sell':'Verkauf','type.split':'Split','type.dividend':'Dividende',
    'type.interest':'Zinsen','type.tax':'Steuer','type.withdrawal':'Abhebung','type.deposit':'Einzahlung',
    'empty.no_txns':'Noch keine Transaktionen','empty.no_holdings':'Noch keine Positionen',
    'empty.loading':'Laden…','empty.no_div':'Keine Dividendendaten gefunden.',
    'empty.no_upcoming':'Keine bevorstehenden Dividenden','empty.no_match':'Keine Positionen gefunden.',
    'toast.settings_saved':'Einstellungen gespeichert!','toast.txn_added':'Transaktion hinzugefügt!',
    'toast.txn_updated':'Transaktion aktualisiert!','toast.txn_deleted':'Transaktion gelöscht!',
    'toast.refreshing':'Kurse werden aktualisiert…','toast.refreshed':'Kurse aktualisiert!',
    'toast.load_error':'Fehler beim Laden der Portfolio-Daten',
    'theme.dark':'Dunkelmodus','theme.light':'Hellmodus',
    'cal.paid':'Bezahlt (erfasst)','cal.yahoo':'Bezahlt (Yahoo)','cal.upcoming':'Bevorstehend (geschätzt)',
    'cal.forecast':'Prognose','cal.current':'(aktuell)',
    'tbl.date':'Datum','tbl.type':'Art','tbl.symbol':'Symbol','tbl.qty':'Menge / Verhältnis',
    'tbl.price':'Preis','tbl.amount':'Betrag','tbl.fees':'Gebühren','tbl.name':'Name',
    'tbl.per_share':'Pro Aktie','tbl.shares':'Aktien','tbl.est_amount':'Gesch. Betrag',
    'tbl.frequency':'Häufigkeit','tbl.avg_cost':'Ø Einstand','tbl.current_price':'Aktueller Kurs',
    'tbl.mkt_value':'Marktwert','tbl.unrealized':'Nicht real. G/V',
    'tbl.day_change':'Tagesveränd.','tbl.weight':'Gewichtung','tbl.actions':'Aktionen',
    'portfolio.create':'Portfolio erstellen','portfolio.rename':'Umbenennen','portfolio.delete':'Löschen',
    'portfolio.switch':'Portfolio wechseln','portfolio.name_placeholder':'Portfolioname',
    'portfolio.cannot_delete':'Das letzte Portfolio kann nicht gelöscht werden','portfolio.active':'Aktiv',
    'benchmark.placeholder':'Benchmark (z.B. SPY)','benchmark.label':'Benchmark',
  },
  'fr-FR': {
    'nav.dashboard':'Tableau de bord','nav.holdings':'Positions','nav.transactions':'Transactions',
    'nav.dividends':'Dividendes','nav.analytics':'Analyses','nav.settings':'Paramètres',
    'metric.total_value':'Valeur totale du portefeuille','metric.unrealized':'Gain / Perte non réalisé(e)',
    'metric.day_change':'Variation journalière','metric.cash':'Solde de trésorerie','metric.available':'Disponible',
    'metric.realized':'Gain / Perte réalisé(e)','metric.dividends':'Dividendes totaux',
    'metric.interest':'Intérêts perçus','metric.fees':'Frais totaux','metric.invested':'Investi',
    'metric.taxes':'Impôts payés','metric.income':'Revenu net (Div + Int)',
    'metric.deposited':'Total déposé','metric.withdrawn':'Total retiré',
    'metric.div_total':'Dividendes reçus','metric.div_yield':'Rendement sur coût',
    'metric.div_yield_sub':'Dividendes / capital investi',
    'metric.div_pa':'Rendement personnel p.a.','metric.div_pa_sub':'12 derniers mois / capital investi',
    'metric.div_forecast':'Prévision annuelle','metric.div_forecast_sub':'12 prochains mois (estimé)',
    'chart.allocation':'Répartition du portefeuille','chart.invested':'Capital investi dans le temps',
    'chart.perf':'Performance vs Référence',
    'chart.recent_txns':'Transactions récentes','chart.annual_div':'Dividendes annuels',
    'chart.monthly_div':'Dividendes mensuels','chart.type_breakdown':'Répartition par type',
    'chart.sector':'Répartition sectorielle','chart.country':'Répartition géographique',
    'section.holdings':'Positions actuelles','section.additional':'Informations supplémentaires',
    'section.txn_history':'Historique des transactions','section.div_calendar':'Calendrier des dividendes',
    'section.upcoming_div':'Dividendes à venir (12 prochains mois)','section.settings':'Paramètres',
    'section.recent_txns':'Transactions récentes',
    'btn.add_txn':'Ajouter une transaction','btn.save':'Enregistrer','btn.cancel':'Annuler',
    'btn.save_settings':'Enregistrer les paramètres','btn.refresh':'Actualiser les cours',
    'btn.export_csv':'Exporter CSV','btn.import_csv':'Importer CSV',
    'btn.view_all':'Voir tout','btn.refresh_calendar':'Actualiser',
    'filter.all_types':'Tous les types','filter.holdings':'Filtrer les positions…',
    'settings.currency':'Devise d\'affichage','settings.currency_desc':'Devise utilisée pour l\'affichage.',
    'settings.locale':'Langue & Format','settings.locale_desc':'Format des dates et des nombres.',
    'settings.preview':'Aperçu du format','settings.preview_desc':'Aperçu des dates et nombres.',
    'settings.sidebar':'Barre latérale','settings.sidebar_desc':'Réduire la barre latérale par défaut.',
    'settings.collapsed':'Réduit par défaut','settings.portfolios':'Gestion des portefeuilles',
    'settings.portfolios_desc':'Créer et gérer plusieurs portefeuilles.',
    'settings.new_portfolio':'Nouveau portefeuille',
    'modal.add_txn':'Ajouter une transaction','modal.edit_txn':'Modifier la transaction',
    'form.type':'Type','form.date':'Date','form.symbol':'Symbole','form.name':'Nom',
    'form.qty':'Quantité','form.price':'Prix par action','form.amount':'Montant',
    'form.fees':'Frais / Commission','form.currency':'Devise','form.notes':'Notes',
    'form.notes_placeholder':'Notes optionnelles','form.symbol_placeholder':'ex. AAPL',
    'form.select_type':'Choisir le type','form.name_placeholder':'Nom de l\'entreprise',
    'form.split_ratio':'Ratio de division (ex. 2)','form.div_amount':'Montant du dividende','form.amount_auto':'Montant (auto)',
    'type.buy':'Achat','type.sell':'Vente','type.split':'Division','type.dividend':'Dividende',
    'type.interest':'Intérêts','type.tax':'Taxe','type.withdrawal':'Retrait','type.deposit':'Dépôt',
    'empty.no_txns':'Aucune transaction','empty.no_holdings':'Aucune position',
    'empty.loading':'Chargement…','empty.no_div':'Aucune donnée de dividende.',
    'empty.no_upcoming':'Aucun dividende prévu','empty.no_match':'Aucune position correspondante.',
    'toast.settings_saved':'Paramètres enregistrés !','toast.txn_added':'Transaction ajoutée !',
    'toast.txn_updated':'Transaction mise à jour !','toast.txn_deleted':'Transaction supprimée !',
    'toast.refreshing':'Actualisation des cours…','toast.refreshed':'Cours actualisés !',
    'toast.load_error':'Échec du chargement des données',
    'theme.dark':'Mode sombre','theme.light':'Mode clair',
    'cal.paid':'Payé (enregistré)','cal.yahoo':'Payé (Yahoo)','cal.upcoming':'À venir (est.)',
    'cal.forecast':'Prévision','cal.current':'(actuel)',
    'tbl.date':'Date','tbl.type':'Type','tbl.symbol':'Symbole','tbl.qty':'Qté / Ratio',
    'tbl.price':'Prix','tbl.amount':'Montant','tbl.fees':'Frais','tbl.name':'Nom',
    'tbl.per_share':'Par action','tbl.shares':'Actions','tbl.est_amount':'Montant est.',
    'tbl.frequency':'Fréquence','tbl.avg_cost':'Coût moy.','tbl.current_price':'Prix actuel',
    'tbl.mkt_value':'Valeur marchande','tbl.unrealized':'G/P non réalisé',
    'tbl.day_change':'Variation journalière','tbl.weight':'Poids','tbl.actions':'Actions',
    'portfolio.create':'Créer un portefeuille','portfolio.rename':'Renommer','portfolio.delete':'Supprimer',
    'portfolio.switch':'Changer de portefeuille','portfolio.name_placeholder':'Nom du portefeuille',
    'portfolio.cannot_delete':'Impossible de supprimer le dernier portefeuille','portfolio.active':'Actif',
    'benchmark.placeholder':'Référence (ex. SPY)','benchmark.label':'Référence',
  },
  'es-ES': {
    'nav.dashboard':'Panel','nav.holdings':'Posiciones','nav.transactions':'Transacciones',
    'nav.dividends':'Dividendos','nav.analytics':'Análisis','nav.settings':'Configuración',
    'metric.total_value':'Valor total','metric.unrealized':'Ganancia / Pérdida no realizada',
    'metric.day_change':'Cambio diario','metric.cash':'Saldo en efectivo','metric.available':'Disponible',
    'metric.realized':'Ganancia / Pérdida realizada','metric.dividends':'Dividendos totales',
    'metric.interest':'Intereses percibidos','metric.fees':'Comisiones totales','metric.invested':'Invertido',
    'metric.taxes':'Impuestos pagados','metric.income':'Ingresos netos (Div + Int)',
    'metric.deposited':'Total depositado','metric.withdrawn':'Total retirado',
    'metric.div_total':'Dividendos recibidos','metric.div_yield':'Rendimiento s/ coste',
    'metric.div_yield_sub':'Dividendos / capital invertido',
    'metric.div_pa':'Rendimiento personal anual','metric.div_pa_sub':'Últimos 12 meses / capital invertido',
    'metric.div_forecast':'Previsión anual','metric.div_forecast_sub':'Próximos 12 meses (est.)',
    'chart.allocation':'Asignación','chart.invested':'Capital invertido en el tiempo',
    'chart.perf':'Rendimiento vs Índice de referencia',
    'chart.recent_txns':'Transacciones recientes','chart.annual_div':'Dividendos anuales',
    'chart.monthly_div':'Dividendos mensuales','chart.type_breakdown':'Desglose por tipo',
    'chart.sector':'Asignación por sector','chart.country':'Asignación por país',
    'section.holdings':'Posiciones actuales','section.additional':'Información adicional',
    'section.txn_history':'Historial de transacciones','section.div_calendar':'Calendario de dividendos',
    'section.upcoming_div':'Próximos dividendos (12 meses)','section.settings':'Configuración',
    'section.recent_txns':'Transacciones recientes',
    'btn.add_txn':'Agregar transacción','btn.save':'Guardar','btn.cancel':'Cancelar',
    'btn.save_settings':'Guardar configuración','btn.refresh':'Actualizar precios',
    'btn.export_csv':'Exportar CSV','btn.import_csv':'Importar CSV',
    'btn.view_all':'Ver todo','btn.refresh_calendar':'Actualizar',
    'filter.all_types':'Todos los tipos','filter.holdings':'Filtrar posiciones…',
    'settings.currency':'Divisa de visualización','settings.currency_desc':'Divisa utilizada para mostrar valores.',
    'settings.locale':'Idioma y formato','settings.locale_desc':'Controla el formato de fechas y números.',
    'settings.preview':'Vista previa del formato','settings.preview_desc':'Vista previa de fechas y números.',
    'settings.sidebar':'Barra lateral','settings.sidebar_desc':'Mantener barra lateral contraída por defecto.',
    'settings.collapsed':'Contraída por defecto','settings.portfolios':'Gestión de carteras',
    'settings.portfolios_desc':'Crea y gestiona múltiples carteras.','settings.new_portfolio':'Nueva cartera',
    'modal.add_txn':'Agregar transacción','modal.edit_txn':'Editar transacción',
    'form.type':'Tipo','form.date':'Fecha','form.symbol':'Símbolo','form.name':'Nombre',
    'form.qty':'Cantidad','form.price':'Precio por acción','form.amount':'Importe',
    'form.fees':'Comisiones','form.currency':'Divisa','form.notes':'Notas',
    'form.notes_placeholder':'Notas opcionales','form.symbol_placeholder':'p.ej. AAPL',
    'form.select_type':'Seleccionar tipo','form.name_placeholder':'Nombre de la empresa',
    'form.split_ratio':'Ratio de desdoblamiento (p.ej. 2)','form.div_amount':'Importe del dividendo','form.amount_auto':'Importe (auto)',
    'type.buy':'Compra','type.sell':'Venta','type.split':'Desdoblamiento','type.dividend':'Dividendo',
    'type.interest':'Interés','type.tax':'Impuesto','type.withdrawal':'Retiro','type.deposit':'Depósito',
    'empty.no_txns':'Sin transacciones','empty.no_holdings':'Sin posiciones',
    'empty.loading':'Cargando…','empty.no_div':'Sin datos de dividendos.',
    'empty.no_upcoming':'Sin dividendos previstos','empty.no_match':'Sin posiciones que coincidan.',
    'toast.settings_saved':'¡Configuración guardada!','toast.txn_added':'¡Transacción añadida!',
    'toast.txn_updated':'¡Transacción actualizada!','toast.txn_deleted':'¡Transacción eliminada!',
    'toast.refreshing':'Actualizando precios…','toast.refreshed':'¡Precios actualizados!',
    'toast.load_error':'Error al cargar datos del portfolio',
    'theme.dark':'Modo oscuro','theme.light':'Modo claro',
    'cal.paid':'Pagado (registrado)','cal.yahoo':'Pagado (Yahoo)','cal.upcoming':'Próximo (est.)',
    'cal.forecast':'Previsión','cal.current':'(actual)',
    'tbl.date':'Fecha','tbl.type':'Tipo','tbl.symbol':'Símbolo','tbl.qty':'Cant. / Ratio',
    'tbl.price':'Precio','tbl.amount':'Importe','tbl.fees':'Comisiones','tbl.name':'Nombre',
    'tbl.per_share':'Por acción','tbl.shares':'Acciones','tbl.est_amount':'Importe est.',
    'tbl.frequency':'Frecuencia','tbl.avg_cost':'Coste medio','tbl.current_price':'Precio actual',
    'tbl.mkt_value':'Valor de mercado','tbl.unrealized':'G/P no realizado',
    'tbl.day_change':'Cambio diario','tbl.weight':'Peso','tbl.actions':'Acciones',
    'portfolio.create':'Crear cartera','portfolio.rename':'Renombrar','portfolio.delete':'Eliminar',
    'portfolio.switch':'Cambiar cartera','portfolio.name_placeholder':'Nombre de la cartera',
    'portfolio.cannot_delete':'No se puede eliminar la última cartera','portfolio.active':'Activa',
    'benchmark.placeholder':'Referencia (p.ej. SPY)','benchmark.label':'Referencia',
  },
  'it-IT': {
    'nav.dashboard':'Pannello','nav.holdings':'Posizioni','nav.transactions':'Transazioni',
    'nav.dividends':'Dividendi','nav.analytics':'Analisi','nav.settings':'Impostazioni',
    'metric.total_value':'Valore totale del portafoglio','metric.unrealized':'Guadagno / Perdita non realizzato/a',
    'metric.day_change':'Variazione giornaliera','metric.cash':'Saldo di cassa','metric.available':'Disponibile',
    'metric.realized':'Guadagno / Perdita realizzato/a','metric.dividends':'Dividendi totali',
    'metric.interest':'Interessi maturati','metric.fees':'Commissioni totali','metric.invested':'Investito',
    'metric.taxes':'Tasse pagate','metric.income':'Reddito netto (Div + Int)',
    'metric.deposited':'Totale depositato','metric.withdrawn':'Totale prelevato',
    'metric.div_total':'Dividendi ricevuti','metric.div_yield':'Rendimento sul costo',
    'metric.div_yield_sub':'Dividendi / capitale investito',
    'metric.div_pa':'Rendimento pers. annuo','metric.div_pa_sub':'Ultimi 12 mesi / capitale investito',
    'metric.div_forecast':'Previsione annuale','metric.div_forecast_sub':'Prossimi 12 mesi (stimato)',
    'chart.allocation':'Allocazione','chart.invested':'Capitale investito nel tempo',
    'chart.perf':'Performance vs Benchmark',
    'chart.recent_txns':'Transazioni recenti','chart.annual_div':'Dividendi annuali',
    'chart.monthly_div':'Dividendi mensili','chart.type_breakdown':'Ripartizione per tipo',
    'chart.sector':'Allocazione per settore','chart.country':'Allocazione per paese',
    'section.holdings':'Posizioni correnti','section.additional':'Informazioni aggiuntive',
    'section.txn_history':'Cronologia transazioni','section.div_calendar':'Calendario dividendi',
    'section.upcoming_div':'Dividendi imminenti (prossimi 12 mesi)','section.settings':'Impostazioni',
    'section.recent_txns':'Transazioni recenti',
    'btn.add_txn':'Aggiungi transazione','btn.save':'Salva','btn.cancel':'Annulla',
    'btn.save_settings':'Salva impostazioni','btn.refresh':'Aggiorna prezzi',
    'btn.export_csv':'Esporta CSV','btn.import_csv':'Importa CSV',
    'btn.view_all':'Vedi tutto','btn.refresh_calendar':'Aggiorna',
    'filter.all_types':'Tutti i tipi','filter.holdings':'Filtra posizioni…',
    'settings.currency':'Valuta di visualizzazione','settings.currency_desc':'Valuta per la visualizzazione dei valori.',
    'settings.locale':'Lingua e formato','settings.locale_desc':'Formato di date e numeri.',
    'settings.preview':'Anteprima formato','settings.preview_desc':'Anteprima date e numeri.',
    'settings.sidebar':'Barra laterale','settings.sidebar_desc':'Comprimi barra laterale per impostazione predefinita.',
    'settings.collapsed':'Compressa per impostazione predefinita','settings.portfolios':'Gestione portafogli',
    'settings.portfolios_desc':'Crea e gestisci più portafogli.','settings.new_portfolio':'Nuovo portafoglio',
    'modal.add_txn':'Aggiungi transazione','modal.edit_txn':'Modifica transazione',
    'form.type':'Tipo','form.date':'Data','form.symbol':'Simbolo','form.name':'Nome',
    'form.qty':'Quantità','form.price':'Prezzo per azione','form.amount':'Importo',
    'form.fees':'Commissioni','form.currency':'Valuta','form.notes':'Note',
    'form.notes_placeholder':'Note opzionali','form.symbol_placeholder':'es. AAPL',
    'form.select_type':'Seleziona tipo','form.name_placeholder':'Nome azienda',
    'form.split_ratio':'Rapporto di frazionamento (es. 2)','form.div_amount':'Importo dividendo','form.amount_auto':'Importo (auto)',
    'type.buy':'Acquisto','type.sell':'Vendita','type.split':'Frazionamento','type.dividend':'Dividendo',
    'type.interest':'Interessi','type.tax':'Tassa','type.withdrawal':'Prelievo','type.deposit':'Deposito',
    'empty.no_txns':'Nessuna transazione','empty.no_holdings':'Nessuna posizione',
    'empty.loading':'Caricamento…','empty.no_div':'Nessun dato sui dividendi.',
    'empty.no_upcoming':'Nessun dividendo previsto','empty.no_match':'Nessuna posizione corrispondente.',
    'toast.settings_saved':'Impostazioni salvate!','toast.txn_added':'Transazione aggiunta!',
    'toast.txn_updated':'Transazione aggiornata!','toast.txn_deleted':'Transazione eliminata!',
    'toast.refreshing':'Aggiornamento prezzi…','toast.refreshed':'Prezzi aggiornati!',
    'toast.load_error':'Errore nel caricamento dei dati',
    'theme.dark':'Modalità scura','theme.light':'Modalità chiara',
    'cal.paid':'Pagato (registrato)','cal.yahoo':'Pagato (Yahoo)','cal.upcoming':'Imminente (est.)',
    'cal.forecast':'Previsione','cal.current':'(corrente)',
    'tbl.date':'Data','tbl.type':'Tipo','tbl.symbol':'Simbolo','tbl.qty':'Qtà / Rapporto',
    'tbl.price':'Prezzo','tbl.amount':'Importo','tbl.fees':'Commissioni','tbl.name':'Nome',
    'tbl.per_share':'Per azione','tbl.shares':'Azioni','tbl.est_amount':'Importo est.',
    'tbl.frequency':'Frequenza','tbl.avg_cost':'Costo medio','tbl.current_price':'Prezzo corrente',
    'tbl.mkt_value':'Valore di mercato','tbl.unrealized':'G/P non realizzato',
    'tbl.day_change':'Variazione giornaliera','tbl.weight':'Peso','tbl.actions':'Azioni',
    'portfolio.create':'Crea portafoglio','portfolio.rename':'Rinomina','portfolio.delete':'Elimina',
    'portfolio.switch':'Cambia portafoglio','portfolio.name_placeholder':'Nome del portafoglio',
    'portfolio.cannot_delete':'Impossibile eliminare l\'ultimo portafoglio','portfolio.active':'Attivo',
    'benchmark.placeholder':'Riferimento (es. SPY)','benchmark.label':'Riferimento',
  },
  'nl-NL': {
    'nav.dashboard':'Dashboard','nav.holdings':'Posities','nav.transactions':'Transacties',
    'nav.dividends':'Dividenden','nav.analytics':'Analyse','nav.settings':'Instellingen',
    'metric.total_value':'Totale portefeuillewaarde','metric.unrealized':'Ongerealiseerde winst/verlies',
    'metric.day_change':'Dagverandering','metric.cash':'Kassaldo','metric.available':'Beschikbaar',
    'metric.realized':'Gerealiseerde winst/verlies','metric.dividends':'Totale dividenden',
    'metric.interest':'Ontvangen rente','metric.fees':'Totale kosten','metric.invested':'Belegd',
    'metric.taxes':'Betaalde belasting','metric.income':'Netto-inkomsten (Div + Rente)',
    'metric.deposited':'Totaal gestort','metric.withdrawn':'Totaal opgenomen',
    'metric.div_total':'Ontvangen dividenden','metric.div_yield':'Dividendrendement',
    'metric.div_yield_sub':'Dividenden / belegd kapitaal',
    'metric.div_pa':'Persoonlijk rendement p.j.','metric.div_pa_sub':'Laatste 12 maanden / belegd kapitaal',
    'metric.div_forecast':'Jaarprognose','metric.div_forecast_sub':'Volgende 12 maanden (geschat)',
    'chart.allocation':'Portefeuilleverdeling','chart.invested':'Belegd kapitaal over tijd',
    'chart.perf':'Portefeuilleprestatie vs Benchmark',
    'chart.recent_txns':'Recente transacties','chart.annual_div':'Jaarlijkse dividenden',
    'chart.monthly_div':'Maandelijkse dividenden','chart.type_breakdown':'Verdeling per type',
    'chart.sector':'Sectorverdeling','chart.country':'Landenverdeling',
    'section.holdings':'Huidige posities','section.additional':'Aanvullende informatie',
    'section.txn_history':'Transactiegeschiedenis','section.div_calendar':'Dividendkalender',
    'section.upcoming_div':'Aankomende dividenden (volgende 12 maanden)','section.settings':'Instellingen',
    'section.recent_txns':'Recente transacties',
    'btn.add_txn':'Transactie toevoegen','btn.save':'Opslaan','btn.cancel':'Annuleren',
    'btn.save_settings':'Instellingen opslaan','btn.refresh':'Koersen vernieuwen',
    'btn.export_csv':'CSV exporteren','btn.import_csv':'CSV importeren',
    'btn.view_all':'Alles bekijken','btn.refresh_calendar':'Vernieuwen',
    'filter.all_types':'Alle typen','filter.holdings':'Posities filteren…',
    'settings.currency':'Weergavevaluta','settings.currency_desc':'Valuta voor weergave van portefeuillewaarden.',
    'settings.locale':'Taal en opmaak','settings.locale_desc':'Bepaalt datum- en getalopmaak in de app.',
    'settings.preview':'Opmaakvòorbeeldk','settings.preview_desc':'Hoe datums en getallen worden weergegeven.',
    'settings.sidebar':'Zijbalk','settings.sidebar_desc':'Zijbalk standaard inklappen.',
    'settings.collapsed':'Standaard ingeklapt','settings.portfolios':'Portefeuillebeheer',
    'settings.portfolios_desc':'Maak en beheer meerdere portefeuilles.','settings.new_portfolio':'Nieuwe portefeuille',
    'modal.add_txn':'Transactie toevoegen','modal.edit_txn':'Transactie bewerken',
    'form.type':'Type','form.date':'Datum','form.symbol':'Symbool','form.name':'Naam',
    'form.qty':'Aantal','form.price':'Prijs per aandeel','form.amount':'Bedrag',
    'form.fees':'Kosten / Commissie','form.currency':'Valuta','form.notes':'Notities',
    'form.notes_placeholder':'Optionele notities','form.symbol_placeholder':'bijv. AAPL',
    'form.select_type':'Type selecteren','form.name_placeholder':'Bedrijfsnaam',
    'form.split_ratio':'Splitverhouding (bijv. 2)','form.div_amount':'Dividendbedrag','form.amount_auto':'Bedrag (auto)',
    'type.buy':'Koop','type.sell':'Verkoop','type.split':'Splitsing','type.dividend':'Dividend',
    'type.interest':'Rente','type.tax':'Belasting','type.withdrawal':'Opname','type.deposit':'Storting',
    'empty.no_txns':'Nog geen transacties','empty.no_holdings':'Nog geen posities',
    'empty.loading':'Laden…','empty.no_div':'Geen dividendgegevens gevonden.',
    'empty.no_upcoming':'Geen aankomende dividenden','empty.no_match':'Geen overeenkomende posities.',
    'toast.settings_saved':'Instellingen opgeslagen!','toast.txn_added':'Transactie toegevoegd!',
    'toast.txn_updated':'Transactie bijgewerkt!','toast.txn_deleted':'Transactie verwijderd!',
    'toast.refreshing':'Koersen vernieuwen…','toast.refreshed':'Koersen vernieuwd!',
    'toast.load_error':'Fout bij het laden van portefeuillegegevens',
    'theme.dark':'Donkere modus','theme.light':'Lichte modus',
    'cal.paid':'Betaald (geregistreerd)','cal.yahoo':'Betaald (Yahoo)','cal.upcoming':'Aankomend (geschat)',
    'cal.forecast':'Prognose','cal.current':'(huidig)',
    'tbl.date':'Datum','tbl.type':'Type','tbl.symbol':'Symbool','tbl.qty':'Aantal / Verhouding',
    'tbl.price':'Prijs','tbl.amount':'Bedrag','tbl.fees':'Kosten','tbl.name':'Naam',
    'tbl.per_share':'Per aandeel','tbl.shares':'Aandelen','tbl.est_amount':'Gesch. bedrag',
    'tbl.frequency':'Frequentie','tbl.avg_cost':'Gemid. kostprijs','tbl.current_price':'Huidige koers',
    'tbl.mkt_value':'Marktwaarde','tbl.unrealized':'Ongerealiseerde W/V',
    'tbl.day_change':'Dagverandering','tbl.weight':'Gewicht','tbl.actions':'Acties',
    'portfolio.create':'Portefeuille aanmaken','portfolio.rename':'Hernoemen','portfolio.delete':'Verwijderen',
    'portfolio.switch':'Portefeuille wisselen','portfolio.name_placeholder':'Portefeuillnaam',
    'portfolio.cannot_delete':'Kan de laatste portefeuille niet verwijderen','portfolio.active':'Actief',
    'benchmark.placeholder':'Benchmark (bijv. SPY)','benchmark.label':'Benchmark',
  },
  'pt-BR': {
    'nav.dashboard':'Painel','nav.holdings':'Ativos','nav.transactions':'Transações',
    'nav.dividends':'Dividendos','nav.analytics':'Análises','nav.settings':'Configurações',
    'metric.total_value':'Valor total da carteira','metric.unrealized':'Ganho / Perda não realizado(a)',
    'metric.day_change':'Variação diária','metric.cash':'Saldo em caixa','metric.available':'Disponível',
    'metric.realized':'Ganho / Perda realizado(a)','metric.dividends':'Total de dividendos',
    'metric.interest':'Juros recebidos','metric.fees':'Total de taxas','metric.invested':'Investido',
    'metric.taxes':'Impostos pagos','metric.income':'Renda líquida (Div + Juros)',
    'metric.deposited':'Total depositado','metric.withdrawn':'Total sacado',
    'metric.div_total':'Dividendos recebidos','metric.div_yield':'Rendimento sobre custo',
    'metric.div_yield_sub':'Dividendos / capital investido',
    'metric.div_pa':'Rendimento pessoal anual','metric.div_pa_sub':'Últimos 12 meses / capital investido',
    'metric.div_forecast':'Previsão anual','metric.div_forecast_sub':'Próximos 12 meses (estimado)',
    'chart.allocation':'Alocação','chart.invested':'Capital investido ao longo do tempo',
    'chart.perf':'Desempenho vs Referência',
    'chart.recent_txns':'Transações recentes','chart.annual_div':'Dividendos anuais',
    'chart.monthly_div':'Dividendos mensais','chart.type_breakdown':'Distribuição por tipo',
    'chart.sector':'Alocação por setor','chart.country':'Alocação por país',
    'section.holdings':'Ativos atuais','section.additional':'Informações adicionais',
    'section.txn_history':'Histórico de transações','section.div_calendar':'Calendário de dividendos',
    'section.upcoming_div':'Próximos dividendos (12 meses)','section.settings':'Configurações',
    'section.recent_txns':'Transações recentes',
    'btn.add_txn':'Adicionar transação','btn.save':'Salvar','btn.cancel':'Cancelar',
    'btn.save_settings':'Salvar configurações','btn.refresh':'Atualizar preços',
    'btn.export_csv':'Exportar CSV','btn.import_csv':'Importar CSV',
    'btn.view_all':'Ver tudo','btn.refresh_calendar':'Atualizar',
    'filter.all_types':'Todos os tipos','filter.holdings':'Filtrar ativos…',
    'settings.currency':'Moeda de exibição','settings.currency_desc':'Moeda padrão para exibição dos valores.',
    'settings.locale':'Idioma e formato','settings.locale_desc':'Controla o formato de datas e números.',
    'settings.preview':'Prévia do formato','settings.preview_desc':'Como datas e números aparecerão.',
    'settings.sidebar':'Barra lateral','settings.sidebar_desc':'Manter barra lateral recolhida por padrão.',
    'settings.collapsed':'Recolhida por padrão','settings.portfolios':'Gerenciamento de carteiras',
    'settings.portfolios_desc':'Crie e gerencie múltiplas carteiras.','settings.new_portfolio':'Nova carteira',
    'modal.add_txn':'Adicionar transação','modal.edit_txn':'Editar transação',
    'form.type':'Tipo','form.date':'Data','form.symbol':'Símbolo','form.name':'Nome',
    'form.qty':'Quantidade','form.price':'Preço por ação','form.amount':'Valor',
    'form.fees':'Taxas / Comissão','form.currency':'Moeda','form.notes':'Notas',
    'form.notes_placeholder':'Notas opcionais','form.symbol_placeholder':'ex. AAPL',
    'form.select_type':'Selecionar tipo','form.name_placeholder':'Nome da empresa',
    'form.split_ratio':'Proporção de desdobramento (ex. 2)','form.div_amount':'Valor do dividendo','form.amount_auto':'Valor (auto)',
    'type.buy':'Compra','type.sell':'Venda','type.split':'Desdobramento','type.dividend':'Dividendo',
    'type.interest':'Juros','type.tax':'Imposto','type.withdrawal':'Saque','type.deposit':'Depósito',
    'empty.no_txns':'Nenhuma transação','empty.no_holdings':'Nenhum ativo',
    'empty.loading':'Carregando…','empty.no_div':'Nenhum dado de dividendos.',
    'empty.no_upcoming':'Nenhum dividendo previsto','empty.no_match':'Nenhum ativo correspondente.',
    'toast.settings_saved':'Configurações salvas!','toast.txn_added':'Transação adicionada!',
    'toast.txn_updated':'Transação atualizada!','toast.txn_deleted':'Transação excluída!',
    'toast.refreshing':'Atualizando preços…','toast.refreshed':'Preços atualizados!',
    'toast.load_error':'Falha ao carregar dados da carteira',
    'theme.dark':'Modo escuro','theme.light':'Modo claro',
    'cal.paid':'Pago (registrado)','cal.yahoo':'Pago (Yahoo)','cal.upcoming':'Próximo (est.)',
    'cal.forecast':'Previsão','cal.current':'(atual)',
    'tbl.date':'Data','tbl.type':'Tipo','tbl.symbol':'Símbolo','tbl.qty':'Qtd / Razão',
    'tbl.price':'Preço','tbl.amount':'Valor','tbl.fees':'Taxas','tbl.name':'Nome',
    'tbl.per_share':'Por ação','tbl.shares':'Ações','tbl.est_amount':'Valor est.',
    'tbl.frequency':'Frequência','tbl.avg_cost':'Custo médio','tbl.current_price':'Preço atual',
    'tbl.mkt_value':'Valor de mercado','tbl.unrealized':'G/P não realizado',
    'tbl.day_change':'Variação diária','tbl.weight':'Peso','tbl.actions':'Ações',
    'portfolio.create':'Criar carteira','portfolio.rename':'Renomear','portfolio.delete':'Excluir',
    'portfolio.switch':'Trocar carteira','portfolio.name_placeholder':'Nome da carteira',
    'portfolio.cannot_delete':'Não é possível excluir a última carteira','portfolio.active':'Ativa',
    'benchmark.placeholder':'Referência (ex. SPY)','benchmark.label':'Referência',
  },
  'ja-JP': {
    'nav.dashboard':'ダッシュボード','nav.holdings':'保有銘柄','nav.transactions':'取引',
    'nav.dividends':'配当','nav.analytics':'分析','nav.settings':'設定',
    'metric.total_value':'ポートフォリオ総額','metric.unrealized':'未実現損益',
    'metric.day_change':'日次変動','metric.cash':'現金残高','metric.available':'利用可能',
    'metric.realized':'実現損益','metric.dividends':'配当合計',
    'metric.interest':'利子収入','metric.fees':'手数料合計','metric.invested':'投資額',
    'metric.taxes':'支払済税額','metric.income':'純収入（配当＋利子）',
    'metric.deposited':'入金合計','metric.withdrawn':'出金合計',
    'metric.div_total':'受取配当合計','metric.div_yield':'取得原価利回り',
    'metric.div_yield_sub':'配当 / 投資元本',
    'metric.div_pa':'個人配当利回り（年）','metric.div_pa_sub':'直近12ヶ月 / 投資元本',
    'metric.div_forecast':'年間予測','metric.div_forecast_sub':'今後12ヶ月（推定）',
    'chart.allocation':'配分','chart.invested':'投資資本の推移',
    'chart.perf':'パフォーマンス vs ベンチマーク',
    'chart.recent_txns':'最近の取引','chart.annual_div':'年間配当',
    'chart.monthly_div':'月間配当','chart.type_breakdown':'取引種別内訳',
    'chart.sector':'セクター配分','chart.country':'国別配分',
    'section.holdings':'保有銘柄','section.additional':'追加情報',
    'section.txn_history':'取引履歴','section.div_calendar':'配当カレンダー',
    'section.upcoming_div':'今後12ヶ月の配当予定','section.settings':'設定',
    'section.recent_txns':'最近の取引',
    'btn.add_txn':'取引を追加','btn.save':'保存','btn.cancel':'キャンセル',
    'btn.save_settings':'設定を保存','btn.refresh':'価格を更新',
    'btn.export_csv':'CSVエクスポート','btn.import_csv':'CSVインポート',
    'btn.view_all':'すべて表示','btn.refresh_calendar':'更新',
    'filter.all_types':'全種別','filter.holdings':'銘柄を検索…',
    'settings.currency':'表示通貨','settings.currency_desc':'ポートフォリオ値の表示に使用する通貨。',
    'settings.locale':'言語と形式','settings.locale_desc':'日付と数値の形式を設定します。',
    'settings.preview':'形式プレビュー','settings.preview_desc':'日付と数値の表示例。',
    'settings.sidebar':'サイドバー','settings.sidebar_desc':'サイドバーをデフォルトで折りたたむ。',
    'settings.collapsed':'デフォルトで折りたたむ','settings.portfolios':'ポートフォリオ管理',
    'settings.portfolios_desc':'複数のポートフォリオを作成・管理します。','settings.new_portfolio':'新しいポートフォリオ',
    'modal.add_txn':'取引を追加','modal.edit_txn':'取引を編集',
    'form.type':'種別','form.date':'日付','form.symbol':'銘柄コード','form.name':'名称',
    'form.qty':'数量','form.price':'1株あたりの価格','form.amount':'金額',
    'form.fees':'手数料','form.currency':'通貨','form.notes':'メモ',
    'form.notes_placeholder':'任意のメモ','form.symbol_placeholder':'例：AAPL',
    'form.select_type':'種別を選択','form.name_placeholder':'企業名',
    'form.split_ratio':'株式分割比率（例：2）','form.div_amount':'配当金額','form.amount_auto':'金額（自動）',
    'type.buy':'買い','type.sell':'売り','type.split':'株式分割','type.dividend':'配当',
    'type.interest':'利子','type.tax':'税金','type.withdrawal':'出金','type.deposit':'入金',
    'empty.no_txns':'取引がありません','empty.no_holdings':'保有銘柄がありません',
    'empty.loading':'読み込み中…','empty.no_div':'配当データが見つかりません。',
    'empty.no_upcoming':'今後の配当予定はありません','empty.no_match':'一致する銘柄がありません。',
    'toast.settings_saved':'設定を保存しました！','toast.txn_added':'取引を追加しました！',
    'toast.txn_updated':'取引を更新しました！','toast.txn_deleted':'取引を削除しました！',
    'toast.refreshing':'価格を更新中…','toast.refreshed':'価格を更新しました！',
    'toast.load_error':'ポートフォリオデータの読み込みに失敗しました',
    'theme.dark':'ダークモード','theme.light':'ライトモード',
    'cal.paid':'支払済（記録）','cal.yahoo':'支払済（Yahoo）','cal.upcoming':'予定（推定）',
    'cal.forecast':'予測','cal.current':'（現在）',
    'tbl.date':'日付','tbl.type':'種別','tbl.symbol':'銘柄コード','tbl.qty':'数量 / 比率',
    'tbl.price':'価格','tbl.amount':'金額','tbl.fees':'手数料','tbl.name':'名称',
    'tbl.per_share':'1株あたり','tbl.shares':'株数','tbl.est_amount':'推定金額',
    'tbl.frequency':'頻度','tbl.avg_cost':'平均取得価格','tbl.current_price':'現在価格',
    'tbl.mkt_value':'時価総額','tbl.unrealized':'未実現損益',
    'tbl.day_change':'日次変動','tbl.weight':'割合','tbl.actions':'操作',
    'portfolio.create':'ポートフォリオを作成','portfolio.rename':'名前を変更','portfolio.delete':'削除',
    'portfolio.switch':'ポートフォリオを切り替え','portfolio.name_placeholder':'ポートフォリオ名',
    'portfolio.cannot_delete':'最後のポートフォリオは削除できません','portfolio.active':'アクティブ',
    'benchmark.placeholder':'ベンチマーク（例：SPY）','benchmark.label':'ベンチマーク',
  },
  'zh-CN': {
    'nav.dashboard':'仪表板','nav.holdings':'持仓','nav.transactions':'交易',
    'nav.dividends':'股息','nav.analytics':'分析','nav.settings':'设置',
    'metric.total_value':'投资组合总值','metric.unrealized':'未实现盈亏',
    'metric.day_change':'当日变动','metric.cash':'现金余额','metric.available':'可用',
    'metric.realized':'已实现盈亏','metric.dividends':'股息总计',
    'metric.interest':'利息收入','metric.fees':'手续费总计','metric.invested':'已投资',
    'metric.taxes':'已缴税款','metric.income':'净收入（股息+利息）',
    'metric.deposited':'总存入','metric.withdrawn':'总取出',
    'metric.div_total':'已收股息总计','metric.div_yield':'持仓成本股息率',
    'metric.div_yield_sub':'股息 / 投入资本',
    'metric.div_pa':'个人股息率（年）','metric.div_pa_sub':'近12个月 / 投入资本',
    'metric.div_forecast':'年度预测','metric.div_forecast_sub':'未来12个月（预估）',
    'chart.allocation':'资产配置','chart.invested':'投资资本随时间变化',
    'chart.perf':'投资组合表现 vs 基准',
    'chart.recent_txns':'最近交易','chart.annual_div':'年度股息',
    'chart.monthly_div':'月度股息','chart.type_breakdown':'交易类型分布',
    'chart.sector':'行业配置','chart.country':'国家配置',
    'section.holdings':'当前持仓','section.additional':'附加信息',
    'section.txn_history':'交易历史','section.div_calendar':'股息日历',
    'section.upcoming_div':'未来12个月股息预期','section.settings':'设置',
    'section.recent_txns':'最近交易',
    'btn.add_txn':'添加交易','btn.save':'保存','btn.cancel':'取消',
    'btn.save_settings':'保存设置','btn.refresh':'刷新价格',
    'btn.export_csv':'导出CSV','btn.import_csv':'导入CSV',
    'btn.view_all':'查看全部','btn.refresh_calendar':'刷新',
    'filter.all_types':'所有类型','filter.holdings':'筛选持仓…',
    'settings.currency':'显示货币','settings.currency_desc':'用于显示投资组合价值的默认货币。',
    'settings.locale':'语言与格式','settings.locale_desc':'控制应用中的日期和数字格式。',
    'settings.preview':'格式预览','settings.preview_desc':'日期和数字在应用中的显示方式。',
    'settings.sidebar':'侧边栏','settings.sidebar_desc':'默认保持侧边栏折叠（仅显示图标）。',
    'settings.collapsed':'默认折叠','settings.portfolios':'投资组合管理',
    'settings.portfolios_desc':'创建和管理多个投资组合。','settings.new_portfolio':'新建投资组合',
    'modal.add_txn':'添加交易','modal.edit_txn':'编辑交易',
    'form.type':'类型','form.date':'日期','form.symbol':'股票代码','form.name':'名称',
    'form.qty':'数量','form.price':'每股价格','form.amount':'金额',
    'form.fees':'手续费','form.currency':'货币','form.notes':'备注',
    'form.notes_placeholder':'可选备注','form.symbol_placeholder':'例：AAPL',
    'form.select_type':'选择类型','form.name_placeholder':'公司名称',
    'form.split_ratio':'拆股比例（例：2）','form.div_amount':'股息金额','form.amount_auto':'金额（自动）',
    'type.buy':'买入','type.sell':'卖出','type.split':'股票拆分','type.dividend':'股息',
    'type.interest':'利息','type.tax':'税款','type.withdrawal':'取出','type.deposit':'存入',
    'empty.no_txns':'暂无交易','empty.no_holdings':'暂无持仓',
    'empty.loading':'加载中…','empty.no_div':'未找到股息数据。',
    'empty.no_upcoming':'暂无预期股息','empty.no_match':'没有匹配的持仓。',
    'toast.settings_saved':'设置已保存！','toast.txn_added':'交易已添加！',
    'toast.txn_updated':'交易已更新！','toast.txn_deleted':'交易已删除！',
    'toast.refreshing':'正在刷新价格…','toast.refreshed':'价格已刷新！',
    'toast.load_error':'加载投资组合数据失败',
    'theme.dark':'深色模式','theme.light':'浅色模式',
    'cal.paid':'已付（已记录）','cal.yahoo':'已付（Yahoo）','cal.upcoming':'即将到来（估）',
    'cal.forecast':'预测','cal.current':'（当前）',
    'tbl.date':'日期','tbl.type':'类型','tbl.symbol':'股票代码','tbl.qty':'数量 / 比例',
    'tbl.price':'价格','tbl.amount':'金额','tbl.fees':'手续费','tbl.name':'名称',
    'tbl.per_share':'每股','tbl.shares':'股数','tbl.est_amount':'估计金额',
    'tbl.frequency':'频率','tbl.avg_cost':'平均成本','tbl.current_price':'当前价格',
    'tbl.mkt_value':'市值','tbl.unrealized':'未实现盈亏',
    'tbl.day_change':'当日变动','tbl.weight':'权重','tbl.actions':'操作',
    'portfolio.create':'创建投资组合','portfolio.rename':'重命名','portfolio.delete':'删除',
    'portfolio.switch':'切换投资组合','portfolio.name_placeholder':'投资组合名称',
    'portfolio.cannot_delete':'无法删除最后一个投资组合','portfolio.active':'活跃',
    'benchmark.placeholder':'基准（例：SPY）','benchmark.label':'基准',
  },
};

function t(key) {
  const locale = settings.locale || 'en-US';
  const map = i18nData[locale] || {};
  if (map[key]) return map[key];
  // fallback to en-US
  return (i18nData['en-US'] || {})[key] || key;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (text) el.textContent = text;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    const text = t(key);
    if (text) el.placeholder = text;
  });
  // Update topbar title for current page
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    const pageId = activePage.id.replace('page-', '');
    const titles = {
      dashboard: t('nav.dashboard'), holdings: t('nav.holdings'),
      transactions: t('nav.transactions'), calendar: t('nav.dividends'),
      analytics: t('nav.analytics'), settings: t('nav.settings'),
    };
    const el = document.getElementById('pageTitle');
    if (el && titles[pageId]) el.textContent = titles[pageId];
  }
  // Theme button
  const theme = document.documentElement.getAttribute('data-theme');
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = theme === 'dark' ? t('theme.dark') : t('theme.light');
}

/* ══════════════════════════════════════════════════════════════
   Settings (persisted to backend + localStorage fallback)
══════════════════════════════════════════════════════════════ */
const settings = {
  currency: 'USD',
  locale: 'en-US',
  sidebarCollapsed: false,
};

async function loadSettings() {
  // Try loading from backend first (settings stored as key-value strings)
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data.currency) settings.currency = data.currency;
      if (data.locale) settings.locale = data.locale;
      if (data.sidebarCollapsed !== undefined) settings.sidebarCollapsed = data.sidebarCollapsed === true || data.sidebarCollapsed === 'true';
      return;
    }
  } catch { /* fallback to localStorage */ }
  try {
    const saved = localStorage.getItem('wf_settings');
    if (saved) Object.assign(settings, JSON.parse(saved));
  } catch { /* ignore */ }
}

async function saveSettings() {
  localStorage.setItem('wf_settings', JSON.stringify(settings));
  try {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currency: settings.currency,
        locale: settings.locale,
        sidebarCollapsed: settings.sidebarCollapsed,
      }),
    });
  } catch { /* ignore – already saved to localStorage */ }
}

/* ══════════════════════════════════════════════════════════════
   State
══════════════════════════════════════════════════════════════ */
const state = {
  portfolio: null,
  transactions: [],
  chartData: null,
  portfolios: [],
  activePortfolioId: 1,
  investedPeriod: 'all',
  perfPeriod: '1y',
  benchmarkSymbol: 'SPY',
  currentHoldingSymbol: null,
  charts: {
    allocation: null, performance: null,
    dividends: null, typeChart: null,
    annualDiv: null, sector: null, country: null,
    portfolioPerf: null,
  },
};

/* ══════════════════════════════════════════════════════════════
   Utilities
══════════════════════════════════════════════════════════════ */
const fmt = (v, decimals = 2) =>
  new Intl.NumberFormat(settings.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);

const fmtMoney = (v, currency) => {
  const cur = currency || settings.currency;
  try {
    return new Intl.NumberFormat(settings.locale, { style: 'currency', currency: cur, minimumFractionDigits: 2 }).format(v);
  } catch { return `${cur} ${fmt(v)}`; }
};

const fmtPct = v => `${v >= 0 ? '+' : ''}${fmt(v)}%`;
const fmtDate = d => new Date(d).toLocaleDateString(settings.locale, { year: 'numeric', month: 'short', day: 'numeric' });
const fmtDateShort = d => new Date(d).toLocaleDateString(settings.locale, { month: 'short', day: 'numeric' });

function sign(v) { return v >= 0 ? 'positive' : 'negative'; }

function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.classList.remove('hidden');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.add('hidden'), 3500);
}

function fmtVolume(v) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return String(v);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function periodToStartDate(period) {
  const now = new Date();
  switch (period) {
    case '1mo':  { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d; }
    case '3mo':  { const d = new Date(now); d.setMonth(d.getMonth() - 3); return d; }
    case '6mo':  { const d = new Date(now); d.setMonth(d.getMonth() - 6); return d; }
    case 'ytd':  return new Date(now.getFullYear(), 0, 1);
    case '1y':   { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d; }
    case '2y':   { const d = new Date(now); d.setFullYear(d.getFullYear() - 2); return d; }
    case '5y':   { const d = new Date(now); d.setFullYear(d.getFullYear() - 5); return d; }
    default:     return null; // 'all'
  }
}

function filterByPeriod(data, period) {
  if (!period || period === 'all') return data;
  const start = periodToStartDate(period);
  if (!start) return data;
  return data.filter(p => new Date(p.date) >= start);
}

/* ══════════════════════════════════════════════════════════════
   Chart helpers
══════════════════════════════════════════════════════════════ */
function chartTheme() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: dark ? '#a1a1aa' : '#71717a',
    grid: dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)',
    tooltip: { bg: dark ? '#1e1e2e' : '#ffffff', border: dark ? '#3f3f50' : '#e4e4e7' },
  };
}

const PALETTE = [
  '#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6',
  '#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16',
  '#06b6d4','#a855f7','#22c55e','#fb923c','#e11d48',
];

function doughnutOptions(labels, th) {
  return {
    responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
    plugins: {
      legend: {
        position: 'right',
        labels: { color: th.text, boxWidth: 12, padding: 10, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : '0.0';
            return ` ${ctx.label}: ${fmtMoney(ctx.raw)} (${pct}%)`;
          },
        },
        backgroundColor: th.tooltip.bg, borderColor: th.tooltip.border, borderWidth: 1,
        titleColor: th.text, bodyColor: th.text,
      },
    },
    cutout: '62%',
  };
}

function lineOptions(th, yFmt, xLabels) {
  return {
    responsive: true, maintainAspectRatio: false,
    animation: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { color: th.text, boxWidth: 12, font: { size: 11 } } },
      tooltip: {
        mode: 'index', intersect: false,
        backgroundColor: th.tooltip.bg, borderColor: th.tooltip.border, borderWidth: 1,
        titleColor: th.text, bodyColor: th.text,
        callbacks: {
          title: ctx => ctx[0] ? fmtDate(ctx[0].label) : '',
          label: ctx => ` ${ctx.dataset.label}: ${yFmt(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: th.text, maxRotation: 0, maxTicksLimit: 8, autoSkip: true },
        grid: { color: th.grid },
      },
      y: {
        ticks: { color: th.text, callback: yFmt },
        grid: { color: th.grid },
      },
    },
  };
}

/* ══════════════════════════════════════════════════════════════
   API helpers
══════════════════════════════════════════════════════════════ */
const pid = () => state.activePortfolioId;

async function apiGet(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `HTTP ${res.status}`); }
  return res.json();
}

async function apiPut(path, body) {
  const res = await fetch(path, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `HTTP ${res.status}`); }
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(path, { method: 'DELETE' });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `HTTP ${res.status}`); }
  return res.json().catch(() => ({}));
}

async function getHistory(symbol, period = '1y') {
  try {
    return await apiGet(`/api/history/${encodeURIComponent(symbol)}?period=${period}`);
  } catch { return []; }
}

/* ══════════════════════════════════════════════════════════════
   Portfolio API
══════════════════════════════════════════════════════════════ */
async function loadPortfolios() {
  try {
    const list = await apiGet('/api/portfolios');
    state.portfolios = list || [];
    if (!state.portfolios.length) state.portfolios = [{ id: 1, name: 'Default' }];
    // Ensure activePortfolioId is valid
    if (!state.portfolios.find(p => p.id === state.activePortfolioId)) {
      state.activePortfolioId = state.portfolios[0].id;
    }
    renderPortfolioSwitcher();
    renderPortfolioList();
  } catch { /* fallback – use default */ }
}

async function createPortfolio(name) {
  const p = await apiPost('/api/portfolios', { name });
  await loadPortfolios();
  switchPortfolio(p.id);
}

async function renamePortfolio(id, name) {
  await apiPut(`/api/portfolios/${id}`, { name });
  await loadPortfolios();
}

async function deletePortfolio(id) {
  if (state.portfolios.length <= 1) { showToast(t('portfolio.cannot_delete'), 'error'); return; }
  if (!confirm(`Delete portfolio "${(state.portfolios.find(p => p.id === id) || {}).name}"?`)) return;
  await apiDelete(`/api/portfolios/${id}`);
  if (state.activePortfolioId === id) {
    const remaining = state.portfolios.filter(p => p.id !== id);
    state.activePortfolioId = remaining[0]?.id || 1;
  }
  await loadPortfolios();
  loadAll();
}

function switchPortfolio(id) {
  state.activePortfolioId = id;
  const p = state.portfolios.find(po => po.id === id);
  document.getElementById('portfolioName').textContent = p ? p.name : 'Portfolio';
  closePortfolioDropdown();
  renderPortfolioList();
  loadAll();
}

/* ── Portfolio Switcher UI ── */
function renderPortfolioSwitcher() {
  const dropdown = document.getElementById('portfolioDropdown');
  const nameEl = document.getElementById('portfolioName');
  const active = state.portfolios.find(p => p.id === state.activePortfolioId);
  if (nameEl && active) nameEl.textContent = active.name;

  if (!dropdown) return;
  dropdown.innerHTML = state.portfolios.map(p => `
    <li class="${p.id === state.activePortfolioId ? 'active' : ''}" data-portfolio-id="${p.id}">
      <i class="fa-solid fa-folder portfolio-icon" style="flex-shrink:0"></i>
      <span class="portfolio-dropdown-name">${escHtml(p.name)}</span>
      <span class="portfolio-item-actions">
        <button class="portfolio-item-btn" data-rename="${p.id}" title="${t('portfolio.rename')}"><i class="fa-solid fa-pen-to-square"></i></button>
        ${state.portfolios.length > 1 ? `<button class="portfolio-item-btn danger" data-delete="${p.id}" title="${t('portfolio.delete')}"><i class="fa-solid fa-trash"></i></button>` : ''}
      </span>
    </li>
  `).join('') + `
    <li class="portfolio-add-btn" id="dropdownAddPortfolio">
      <i class="fa-solid fa-plus"></i> <span>${t('settings.new_portfolio')}</span>
    </li>
  `;

  // Events inside dropdown
  dropdown.querySelectorAll('li[data-portfolio-id]').forEach(li => {
    li.addEventListener('click', e => {
      if (e.target.closest('[data-rename]') || e.target.closest('[data-delete]')) return;
      switchPortfolio(Number(li.dataset.portfolioId));
    });
  });
  dropdown.querySelectorAll('[data-rename]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openRenameModal(Number(btn.dataset.rename)); });
  });
  dropdown.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); deletePortfolio(Number(btn.dataset.delete)); });
  });
  const addBtn = dropdown.querySelector('#dropdownAddPortfolio');
  if (addBtn) addBtn.addEventListener('click', () => { closePortfolioDropdown(); promptNewPortfolio(); });
}

function renderPortfolioList() {
  const el = document.getElementById('portfolioList');
  if (!el) return;
  el.innerHTML = state.portfolios.map(p => `
    <div class="portfolio-list-item">
      <span class="portfolio-list-name"><i class="fa-solid fa-folder" style="color:var(--primary);margin-right:8px"></i>${escHtml(p.name)}</span>
      ${p.id === state.activePortfolioId ? `<span class="portfolio-list-badge">${t('portfolio.active')}</span>` : `<button class="btn btn-ghost btn-sm" onclick="switchPortfolio(${p.id})">${t('portfolio.switch')}</button>`}
      <button class="btn btn-ghost btn-sm" onclick="openRenameModal(${p.id})"><i class="fa-solid fa-pen-to-square"></i></button>
      ${state.portfolios.length > 1 ? `<button class="btn btn-ghost btn-sm" onclick="deletePortfolio(${p.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>` : ''}
    </div>
  `).join('');
}

function openPortfolioDropdown() {
  const dd = document.getElementById('portfolioDropdown');
  const sw = document.getElementById('portfolioSwitcher');
  if (!dd) return;
  dd.classList.toggle('hidden');
  sw.classList.toggle('open');
}

function closePortfolioDropdown() {
  document.getElementById('portfolioDropdown')?.classList.add('hidden');
  document.getElementById('portfolioSwitcher')?.classList.remove('open');
}

/* Rename modal */
let _renamePortfolioId = null;
function openRenameModal(id) {
  _renamePortfolioId = id;
  const p = state.portfolios.find(po => po.id === id);
  const input = document.getElementById('renamePortfolioInput');
  if (input) input.value = p ? p.name : '';
  document.getElementById('renamePortfolioOverlay')?.classList.remove('hidden');
  closePortfolioDropdown();
}
function closeRenameModal() {
  document.getElementById('renamePortfolioOverlay')?.classList.add('hidden');
}
async function saveRenamePortfolio() {
  const name = document.getElementById('renamePortfolioInput')?.value.trim();
  if (!name || !_renamePortfolioId) return;
  try { await renamePortfolio(_renamePortfolioId, name); } catch (e) { showToast(e.message, 'error'); }
  closeRenameModal();
}

function promptNewPortfolio() {
  const input = document.getElementById('newPortfolioName');
  if (input) { input.value = ''; input.focus(); }
  showPage('settings');
}


/* ══════════════════════════════════════════════════════════════
   Navigation & Sidebar
══════════════════════════════════════════════════════════════ */
const pageTitleMap = () => ({
  dashboard: t('nav.dashboard'), holdings: t('nav.holdings'),
  transactions: t('nav.transactions'), calendar: t('nav.dividends'),
  analytics: t('nav.analytics'), settings: t('nav.settings'),
});

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById(`page-${name}`);
  if (page) page.classList.add('active');
  const navItem = document.querySelector(`.nav-item[data-page="${name}"]`);
  if (navItem) navItem.classList.add('active');
  document.getElementById('pageTitle').textContent = pageTitleMap()[name] || '';
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
  // Trigger page-specific actions
  if (name === 'analytics') renderAnalyticsPage();
  if (name === 'calendar') renderCalendarPage();
}

function initNav() {
  document.querySelectorAll('.nav-item').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); showPage(a.dataset.page); });
  });
  document.querySelectorAll('[data-page]').forEach(a => {
    if (a.classList.contains('nav-item')) return;
    a.addEventListener('click', e => { e.preventDefault(); showPage(a.dataset.page); });
  });
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const colBtn = document.getElementById('sidebarCollapseBtn');
  const icon = document.getElementById('sidebarCollapseIcon');
  const overlay = document.getElementById('sidebarOverlay');
  const menuBtn = document.getElementById('menuBtn');

  function setCollapsed(v) {
    document.body.classList.toggle('sidebar-collapsed', v);
    document.querySelector('.main')?.style.setProperty('margin-left', v ? 'var(--sidebar-collapsed-w)' : 'var(--sidebar-w)');
    if (icon) { icon.className = v ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'; }
    settings.sidebarCollapsed = v;
  }

  if (settings.sidebarCollapsed) setCollapsed(true);

  if (colBtn) colBtn.addEventListener('click', () => setCollapsed(!settings.sidebarCollapsed));
  if (menuBtn) menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

/* ══════════════════════════════════════════════════════════════
   Dashboard Metrics
══════════════════════════════════════════════════════════════ */
function renderDashboard(data) {
  // Map backend snake_case fields to frontend variables
  const summary = {
    totalValue:      data.total_value      ?? 0,
    totalCost:       data.total_cost       ?? 0,
    totalUnrealized: data.total_unrealized_gain ?? 0,
    totalRealized:   data.total_realized_gain   ?? 0,
    totalDividends:  data.total_dividends  ?? 0,
    totalInterest:   data.total_interest   ?? 0,
    totalFees:       data.total_fees       ?? 0,
    totalTaxes:      data.total_taxes      ?? 0,
    totalDeposited:  data.total_deposited  ?? 0,
    totalWithdrawn:  data.total_withdrawn  ?? 0,
    cashBalance:     data.cash_balance     ?? 0,
    totalDayChange:  data.day_change       ?? 0,
    totalDayChangePct: data.day_change_pct ?? 0,
  };
  // Map holding fields from snake_case to camelCase
  const holdings = (data.holdings || []).map(h => ({
    ...h,
    avgCost:      h.average_cost   ?? 0,
    currentPrice: h.current_price  ?? 0,
    marketValue:  h.current_value  ?? 0,
    unrealizedPL: h.unrealized_gain ?? 0,
    dayChange:    h.day_change      ?? 0,
  }));

  setText('mv-total', fmtMoney(summary.totalValue));
  setText('ms-total', `${t('metric.invested')}: ${fmtMoney(summary.totalCost)}`);

  const unreal = summary.totalUnrealized;
  const unrealPct = summary.totalCost > 0 ? (unreal / summary.totalCost) * 100 : 0;
  setValAndClass('mv-unrealized', `${fmtMoney(unreal)} (${fmtPct(unrealPct)})`, sign(unreal));
  setText('ms-unrealized', '');

  const day = summary.totalDayChange;
  const dayPct = (summary.totalValue - day) > 0 ? (day / (summary.totalValue - day)) * 100 : 0;
  setValAndClass('mv-day', `${fmtMoney(day)} (${fmtPct(dayPct)})`, sign(day));

  setText('mv-cash', fmtMoney(summary.cashBalance));
  setText('ms-cash', t('metric.available'));

  // Extra metrics (holdings page)
  setValAndClass('mv-realized', fmtMoney(summary.totalRealized), sign(summary.totalRealized));
  setText('mv-dividends', fmtMoney(summary.totalDividends));
  setText('mv-interest', fmtMoney(summary.totalInterest));
  setText('mv-fees', `−${fmtMoney(summary.totalFees)}`);

  // Analytics metrics
  setText('mv-taxes', fmtMoney(summary.totalTaxes));
  setText('mv-income', fmtMoney(summary.totalDividends + summary.totalInterest));
  setText('mv-deposited', fmtMoney(summary.totalDeposited));
  setText('mv-withdrawn', fmtMoney(summary.totalWithdrawn));

  renderHoldingsTable(holdings, summary.cashBalance);
  renderAllocationChart(holdings, summary.cashBalance);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setValAndClass(id, val, cls) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = val;
  el.className = `metric-value ${cls}`;
}

/* ══════════════════════════════════════════════════════════════
   Allocation Chart (with Cash)
══════════════════════════════════════════════════════════════ */
function renderAllocationChart(holdings, cashBalance = 0) {
  const canvas = document.getElementById('allocationChart');
  if (!canvas) return;
  if (state.charts.allocation) { state.charts.allocation.destroy(); state.charts.allocation = null; }

  const th = chartTheme();
  const items = holdings
    .filter(h => h.marketValue > 0)
    .sort((a, b) => b.marketValue - a.marketValue);

  const labels = items.map(h => h.symbol);
  const data = items.map(h => h.marketValue);

  // Add cash slice if positive
  if (cashBalance > 0) {
    labels.push('Cash');
    data.push(cashBalance);
  }

  if (!data.length) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  state.charts.allocation = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: PALETTE.slice(0, labels.length).map((c, i) =>
          labels[i] === 'Cash' ? '#10b981' : c
        ),
        borderWidth: 2,
        borderColor: 'transparent',
        hoverOffset: 8,
      }],
    },
    options: doughnutOptions(labels, th),
  });
}

/* ══════════════════════════════════════════════════════════════
   Performance Chart (Invested Capital, with period filter)
══════════════════════════════════════════════════════════════ */
function renderPerformanceChart(allData, period) {
  const canvas = document.getElementById('performanceChart');
  if (!canvas) return;
  if (state.charts.performance) { state.charts.performance.destroy(); state.charts.performance = null; }

  const filtered = filterByPeriod(allData, period);
  if (!filtered.length) return;

  const th = chartTheme();
  const labels = filtered.map(p => p.date);
  const values = filtered.map(p => p.value);

  state.charts.performance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: t('chart.invested'),
        data: values,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,.12)',
        fill: true,
        tension: 0,
        stepped: 'after',
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#6366f1',
        borderWidth: 2,
      }],
    },
    options: lineOptions(th, fmtMoney, labels),
  });
}

/* ══════════════════════════════════════════════════════════════
   Portfolio Performance vs Benchmark Chart
══════════════════════════════════════════════════════════════ */
async function renderPortfolioPerformanceChart(period) {
  const canvas = document.getElementById('portfolioPerfChart');
  if (!canvas) return;
  if (state.charts.portfolioPerf) { state.charts.portfolioPerf.destroy(); state.charts.portfolioPerf = null; }

  const chartData = state.chartData;
  if (!chartData || !chartData.invested || !chartData.invested.length) return;

  const th = chartTheme();
  const filtered = filterByPeriod(chartData.invested, period);
  if (!filtered.length) return;

  const investedLabels = filtered.map(p => p.date);
  const investedValues = filtered.map(p => p.value);
  const firstValue = investedValues[0] || 0;

  const datasets = [{
    label: t('chart.invested'),
    data: investedValues,
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,.10)',
    fill: true,
    tension: 0,
    stepped: 'after',
    pointRadius: 0,
    pointHoverRadius: 5,
    borderWidth: 2,
  }];

  // Fetch benchmark
  const sym = state.benchmarkSymbol;
  if (sym && sym.trim()) {
    const apiPeriod = period === 'all' ? '5y' : period;
    const history = await getHistory(sym.trim().toUpperCase(), apiPeriod);
    if (history && history.length && firstValue > 0) {
      // Build a date->close map for the benchmark
      const priceMap = {};
      history.forEach(p => { priceMap[p.date] = p.close; });

      // Align benchmark to the first date of the invested period
      const firstDate = filtered[0].date;
      // Find benchmark close on or just after firstDate
      const sortedDates = Object.keys(priceMap).sort();
      const refDate = sortedDates.find(d => d >= firstDate) || sortedDates[0];
      const refPrice = priceMap[refDate];

      if (refPrice > 0) {
        // For each invested label date, find closest benchmark price
        const benchmarkValues = investedLabels.map(date => {
          // Find closest benchmark date <= this date
          let closest = null;
          for (const d of sortedDates) {
            if (d <= date) closest = d;
            else break;
          }
          if (!closest) return null;
          return firstValue * (priceMap[closest] / refPrice);
        });

        datasets.push({
          label: `${sym} (${t('benchmark.label')})`,
          data: benchmarkValues,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2,
          borderDash: [],
        });
      }
    }
  }

  const opts = lineOptions(th, fmtMoney, investedLabels);
  // Override legend to show both lines
  opts.plugins.legend.display = true;

  state.charts.portfolioPerf = new Chart(canvas, {
    type: 'line',
    data: { labels: investedLabels, datasets },
    options: opts,
  });
}

/* ── Period buttons wiring ── */
function initPeriodButtons() {
  // Invested Capital period buttons
  document.getElementById('investedPeriodBtns')?.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('investedPeriodBtns').querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.investedPeriod = btn.dataset.investedPeriod;
      if (state.chartData?.invested) renderPerformanceChart(state.chartData.invested, state.investedPeriod);
    });
  });

  // Portfolio Performance period buttons
  document.getElementById('perfPeriodBtns')?.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('perfPeriodBtns').querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.perfPeriod = btn.dataset.perfPeriod;
      renderPortfolioPerformanceChart(state.perfPeriod);
    });
  });
}


/* ══════════════════════════════════════════════════════════════
   Recent Transactions (Dashboard)
══════════════════════════════════════════════════════════════ */
function renderRecentTransactions(transactions) {
  const el = document.getElementById('recentTxns');
  if (!el) return;
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  if (!recent.length) {
    el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-list-ul"></i><p>${t('empty.no_txns')}</p></div>`;
    return;
  }
  el.innerHTML = `<table class="data-table"><thead><tr>
    <th>${t('tbl.date')}</th><th>${t('tbl.type')}</th><th>${t('tbl.symbol')}</th>
    <th class="text-right">${t('tbl.amount')}</th>
  </tr></thead><tbody>
    ${recent.map(tx => `<tr>
      <td>${fmtDate(tx.date)}</td>
      <td><span class="badge badge-${tx.type}">${typeLabel(tx.type)}</span></td>
      <td>${tx.symbol ? escHtml(tx.symbol) : '–'}</td>
      <td class="text-right ${sign(txnAmount(tx))}">${fmtMoney(Math.abs(txnAmount(tx)), tx.currency)}</td>
    </tr>`).join('')}
  </tbody></table>`;
}

function typeLabel(type) {
  const m = {
    buy: t('type.buy'), sell: t('type.sell'), split: t('type.split'),
    dividend: t('type.dividend'), interest_earning: t('type.interest'),
    tax: t('type.tax'), withdrawal: t('type.withdrawal'), deposit: t('type.deposit'),
  };
  return m[type] || type;
}

function txnAmount(tx) {
  switch (tx.type) {
    case 'buy': return -(tx.quantity * tx.price + tx.fees);
    case 'sell': return tx.quantity * tx.price - tx.fees;
    case 'dividend': case 'interest_earning': case 'deposit': return tx.amount || 0;
    case 'tax': case 'withdrawal': return -(tx.amount || 0);
    default: return 0;
  }
}

/* ══════════════════════════════════════════════════════════════
   Holdings Page
══════════════════════════════════════════════════════════════ */
function renderHoldingsTable(holdings, cashBalance = 0) {
  const el = document.getElementById('holdingsTable');
  const cards = document.getElementById('holdingCards');
  if (!el) return;

  if (!holdings || !holdings.length) {
    el.innerHTML = `<div class="empty-state holdings-empty"><i class="fa-solid fa-briefcase"></i><p>${t('empty.no_holdings')}</p></div>`;
    if (cards) cards.innerHTML = '';
    return;
  }

  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0) + cashBalance;

  const rows = holdings.map(h => {
    const weight = totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0;
    const plClass = sign(h.unrealizedPL);
    const dayClass = sign(h.dayChange);
    return `<tr class="holding-row" data-symbol="${escHtml(h.symbol)}">
      <td><span class="symbol-chip">${escHtml(h.symbol)}</span></td>
      <td class="muted text-sm">${escHtml(h.name || '')}</td>
      <td class="text-right">${fmt(h.quantity)}</td>
      <td class="text-right">${fmtMoney(h.avgCost, h.currency)}</td>
      <td class="text-right">${fmtMoney(h.currentPrice, h.currency)}</td>
      <td class="text-right">${fmtMoney(h.marketValue)}</td>
      <td class="text-right ${plClass}">${fmtMoney(h.unrealizedPL)}<br><small>${fmtPct((h.unrealizedPL / (h.avgCost * h.quantity || 1)) * 100)}</small></td>
      <td class="text-right ${dayClass}">${fmtMoney(h.dayChange)}</td>
      <td class="text-right muted">${fmt(weight, 1)}%</td>
    </tr>`;
  }).join('');

  el.innerHTML = `
    <div class="holdings-table-wrap">
      <table class="data-table">
        <thead><tr>
          <th>${t('tbl.symbol')}</th><th>${t('tbl.name')}</th><th class="text-right">${t('tbl.shares')}</th>
          <th class="text-right">${t('tbl.avg_cost')}</th><th class="text-right">${t('tbl.current_price')}</th>
          <th class="text-right">${t('tbl.mkt_value')}</th><th class="text-right">${t('tbl.unrealized')}</th>
          <th class="text-right">${t('tbl.day_change')}</th><th class="text-right">${t('tbl.weight')}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
  if (cards) renderHoldingCards(holdings, totalValue);

  // Row click → detail panel
  el.querySelectorAll('.holding-row').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => loadHoldingDetail(row.dataset.symbol));
  });
}

function renderHoldingCards(holdings, totalValue) {
  const cards = document.getElementById('holdingCards');
  if (!cards) return;
  cards.innerHTML = holdings.map(h => {
    const weight = totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0;
    const plClass = sign(h.unrealizedPL);
    return `<div class="holding-card">
      <div class="holding-card-header">
        <div><div class="holding-card-sym">${escHtml(h.symbol)}</div><div class="holding-card-name">${escHtml(h.name || '')}</div></div>
        <div class="holding-card-price ${plClass}">${fmtMoney(h.currentPrice, h.currency)}</div>
      </div>
      <div class="holding-card-grid">
        <div class="holding-card-item"><label>${t('tbl.shares')}</label><span>${fmt(h.quantity)}</span></div>
        <div class="holding-card-item"><label>${t('tbl.mkt_value')}</label><span>${fmtMoney(h.marketValue)}</span></div>
        <div class="holding-card-item"><label>${t('tbl.unrealized')}</label><span class="${plClass}">${fmtMoney(h.unrealizedPL)}</span></div>
        <div class="holding-card-item"><label>${t('tbl.weight')}</label><span>${fmt(weight, 1)}%</span></div>
      </div>
    </div>`;
  }).join('');
}

async function loadHoldingDetail(symbol) {
  const panelEl = document.getElementById('holdingDetailPanel');
  if (!panelEl) return;
  if (panelEl.dataset.sym === symbol && !panelEl.classList.contains('hidden')) {
    panelEl.classList.add('hidden');
    panelEl.dataset.sym = '';
    return;
  }
  panelEl.dataset.sym = symbol;
  panelEl.classList.remove('hidden');
  panelEl.innerHTML = `<div class="empty-state">${t('empty.loading')}</div>`;
  try {
    const data = await apiGet(`/api/quote/${encodeURIComponent(symbol)}`);
    renderHoldingDetail(panelEl, symbol, data);
  } catch (e) {
    panelEl.innerHTML = `<div class="empty-state">Error: ${escHtml(e.message)}</div>`;
  }
}

function renderHoldingDetail(panel, symbol, q) {
  const chg = q.change ?? 0;
  const chgPct = q.changePercent ?? 0;
  const chgClass = sign(chg);
  panel.innerHTML = `
    <div class="holding-detail-header">
      <div>
        <div class="holding-detail-sym">${escHtml(symbol)}</div>
        <div class="holding-detail-name">${escHtml(q.name || '')}</div>
        <div class="holding-detail-meta">
          ${q.exchange ? `<span class="holding-detail-tag">${escHtml(q.exchange)}</span>` : ''}
          ${q.sector ? `<span class="holding-detail-tag">${escHtml(q.sector)}</span>` : ''}
          ${q.industry ? `<span class="holding-detail-tag">${escHtml(q.industry)}</span>` : ''}
          ${q.country ? `<span class="holding-detail-tag">${escHtml(q.country)}</span>` : ''}
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:1.4rem;font-weight:700">${fmtMoney(q.price, q.currency)}</div>
        <div class="${chgClass}">${fmtMoney(chg, q.currency)} (${fmtPct(chgPct)})</div>
      </div>
      <button class="holding-detail-close" id="holdingDetailClose"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="holding-detail-grid">
      ${q.marketCap ? `<div class="holding-detail-item"><label>Market Cap</label><span>${fmtVolume(q.marketCap)}</span></div>` : ''}
      ${q.volume ? `<div class="holding-detail-item"><label>Volume</label><span>${fmtVolume(q.volume)}</span></div>` : ''}
      ${q.avgVolume ? `<div class="holding-detail-item"><label>Avg Volume</label><span>${fmtVolume(q.avgVolume)}</span></div>` : ''}
      ${q.peRatio ? `<div class="holding-detail-item"><label>P/E Ratio</label><span>${fmt(q.peRatio, 2)}</span></div>` : ''}
      ${q.eps ? `<div class="holding-detail-item"><label>EPS</label><span>${fmtMoney(q.eps, q.currency)}</span></div>` : ''}
      ${q.dividendYield ? `<div class="holding-detail-item"><label>Div. Yield</label><span>${fmtPct(q.dividendYield * 100)}</span></div>` : ''}
      ${q.fiftyTwoWeekHigh ? `<div class="holding-detail-item"><label>52W High</label><span>${fmtMoney(q.fiftyTwoWeekHigh, q.currency)}</span></div>` : ''}
      ${q.fiftyTwoWeekLow ? `<div class="holding-detail-item"><label>52W Low</label><span>${fmtMoney(q.fiftyTwoWeekLow, q.currency)}</span></div>` : ''}
      ${q.beta ? `<div class="holding-detail-item"><label>Beta</label><span>${fmt(q.beta, 2)}</span></div>` : ''}
      ${q.forwardPE ? `<div class="holding-detail-item"><label>Fwd P/E</label><span>${fmt(q.forwardPE, 2)}</span></div>` : ''}
    </div>
    ${q.description ? `<div class="holding-detail-desc">${escHtml(q.description)}</div>` : ''}
  `;
  document.getElementById('holdingDetailClose')?.addEventListener('click', () => {
    panel.classList.add('hidden');
    panel.dataset.sym = '';
  });
}

/* Holding search filter */
function initHoldingSearch() {
  const input = document.getElementById('holdingSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    const rows = document.querySelectorAll('#holdingsTable .holding-row');
    const cards = document.querySelectorAll('#holdingCards .holding-card');
    let any = false;
    rows.forEach((row, i) => {
      const sym = (row.dataset.symbol || '').toLowerCase();
      const name = row.cells[1]?.textContent.toLowerCase() || '';
      const match = !q || sym.includes(q) || name.includes(q);
      row.style.display = match ? '' : 'none';
      if (cards[i]) cards[i].style.display = match ? '' : 'none';
      if (match) any = true;
    });
    const emptyMsg = document.getElementById('holdingEmptyMsg');
    if (emptyMsg) emptyMsg.style.display = !any ? '' : 'none';
  });
}

/* Refresh prices */
function initRefreshHoldings() {
  document.getElementById('refreshHoldings')?.addEventListener('click', async () => {
    showToast(t('toast.refreshing'), 'info');
    try {
      await loadAll();
      showToast(t('toast.refreshed'));
    } catch { showToast(t('toast.load_error'), 'error'); }
  });
}


/* ══════════════════════════════════════════════════════════════
   Transaction Page
══════════════════════════════════════════════════════════════ */
function renderTransactionsTable(transactions) {
  const el = document.getElementById('transactionsTable');
  if (!el) return;
  if (!transactions.length) {
    el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-list-ul"></i><p>${t('empty.no_txns')}</p></div>`;
    return;
  }
  el.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          <th>${t('tbl.date')}</th><th>${t('tbl.type')}</th><th>${t('tbl.symbol')}</th>
          <th class="text-right">${t('tbl.qty')}</th><th class="text-right">${t('tbl.price')}</th>
          <th class="text-right">${t('tbl.amount')}</th><th class="text-right">${t('tbl.fees')}</th>
          <th>${t('form.notes')}</th><th>${t('tbl.actions')}</th>
        </tr></thead>
        <tbody>
          ${transactions.map(tx => `
            <tr>
              <td>${fmtDate(tx.date)}</td>
              <td><span class="badge badge-${tx.type}">${typeLabel(tx.type)}</span></td>
              <td>${tx.symbol ? `<span class="symbol-chip">${escHtml(tx.symbol)}</span>` : '–'}</td>
              <td class="text-right">${tx.quantity ? fmt(tx.quantity) : (tx.splitRatio ? `${tx.splitRatio}:1` : '–')}</td>
              <td class="text-right">${tx.price ? fmtMoney(tx.price, tx.currency) : '–'}</td>
              <td class="text-right">${tx.amount ? fmtMoney(tx.amount, tx.currency) : (tx.price && tx.quantity ? fmtMoney(tx.price * tx.quantity, tx.currency) : '–')}</td>
              <td class="text-right muted">${tx.fees ? fmtMoney(tx.fees, tx.currency) : '–'}</td>
              <td class="muted text-sm" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(tx.notes || '')}</td>
              <td>
                <button class="icon-btn" data-edit="${tx.id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="icon-btn danger" data-delete="${tx.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;

  el.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(Number(btn.dataset.edit)));
  });
  el.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteTxn(Number(btn.dataset.delete)));
  });
}

let _txnFilterType = '';
function initTransactionFilter() {
  const sel = document.getElementById('filterType');
  if (!sel) return;
  sel.addEventListener('change', () => {
    _txnFilterType = sel.value;
    const filtered = _txnFilterType
      ? state.transactions.filter(t => t.type === _txnFilterType)
      : state.transactions;
    renderTransactionsTable(filtered);
  });
}

async function deleteTxn(id) {
  if (!confirm('Delete this transaction?')) return;
  try {
    await apiDelete(`/api/transactions/${id}`);
    showToast(t('toast.txn_deleted'));
    await loadAll();
  } catch (e) { showToast(e.message, 'error'); }
}

/* ══════════════════════════════════════════════════════════════
   CSV Export / Import
══════════════════════════════════════════════════════════════ */
function initCsv() {
  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    window.location.href = `/api/export?portfolio_id=${pid()}`;
  });

  document.getElementById('importCsvInput')?.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`/api/import?portfolio_id=${pid()}`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Import successful!');
      await loadAll();
    } catch (err) { showToast(err.message, 'error'); }
    e.target.value = '';
  });
}

/* ══════════════════════════════════════════════════════════════
   Dividend Calendar Page
══════════════════════════════════════════════════════════════ */
async function renderCalendarPage() {
  try {
    const data = await apiGet(`/api/dividends/calendar?portfolio_id=${pid()}`);
    renderDivMetrics(data);
    renderCalendarGrid(data.months || []);
    renderUpcomingTable(data.upcoming || []);
    renderAnnualDivChart(data.annual || []);
  } catch (e) { showToast(t('toast.load_error'), 'error'); }
}

function renderDivMetrics(data) {
  setText('dv-total', fmtMoney(data.totalDividends || 0));
  setText('dv-total-sub', `${fmtMoney(data.totalDividendsLast12 || 0)} last 12 months`);
  setText('dv-yield', data.yieldOnCost ? fmtPct(data.yieldOnCost * 100) : '–');
  setText('dv-pa', data.personalYieldPA ? fmtPct(data.personalYieldPA * 100) : '–');
  setText('dv-forecast', data.annualForecast ? fmtMoney(data.annualForecast) : '–');
}

function renderCalendarGrid(months) {
  const el = document.getElementById('dividendCalendar');
  if (!el) return;
  if (!months.length) {
    el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-calendar-days"></i><p style="white-space:pre-line">${t('empty.no_div')}</p></div>`;
    return;
  }
  el.innerHTML = `<div class="calendar-months">${months.map(mon => renderCalendarMonth(mon)).join('')}</div>`;
  el.querySelectorAll('.cal-record-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const { symbol, amount, date, currency } = btn.dataset;
      openDivRecordModal(symbol, amount, date, currency);
    });
  });
}

function renderCalendarMonth(mon) {
  return `<div class="calendar-month">
    <div class="calendar-month-name">${new Date(mon.year, mon.month - 1).toLocaleDateString(settings.locale, { month: 'long', year: 'numeric' })}</div>
    <div class="calendar-events">
      ${(mon.events || []).map(ev => {
        const isPaid = ev.entry_type === 'paid';
        const isForecast = ev.entry_type === 'forecast';
        const dotClass = isPaid ? (ev.source === 'yahoo' ? 'cal-yahoo' : 'cal-paid') : (isForecast ? 'cal-forecast' : 'cal-upcoming');
        const dotLabel = isPaid ? (ev.source === 'yahoo' ? t('cal.yahoo') : t('cal.paid')) : (isForecast ? t('cal.forecast') : t('cal.upcoming'));
        const amount = ev.total_amount ?? 0;
        return `<div class="calendar-event">
          <span class="cal-dot ${dotClass}" title="${dotLabel}"></span>
          <div class="cal-event-info">
            <span class="cal-event-sym">${escHtml(ev.symbol)}</span>
            <span class="cal-event-date muted text-sm">${fmtDateShort(ev.date)}</span>
          </div>
          <span class="cal-event-amount ${sign(amount)}">${fmtMoney(amount, ev.currency)}</span>
          ${!isPaid ? `<button class="cal-record-btn" data-symbol="${escHtml(ev.symbol)}" data-amount="${amount}" data-date="${ev.date}" data-currency="${ev.currency || settings.currency}"><i class="fa-solid fa-check"></i> Record</button>` : ''}
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderUpcomingTable(upcoming) {
  const el = document.getElementById('upcomingDividends');
  if (!el) return;
  if (!upcoming.length) {
    el.innerHTML = `<div class="cal-empty">${t('empty.no_upcoming')}</div>`;
    return;
  }
  el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr>
    <th>${t('tbl.symbol')}</th><th>${t('tbl.name')}</th>
    <th class="text-right">${t('tbl.per_share')}</th><th class="text-right">${t('tbl.shares')}</th>
    <th class="text-right">${t('tbl.est_amount')}</th><th>${t('tbl.frequency')}</th>
    <th>${t('tbl.date')}</th>
  </tr></thead><tbody>
    ${upcoming.map(d => `<tr>
      <td><span class="symbol-chip">${escHtml(d.symbol)}</span></td>
      <td class="muted text-sm">${escHtml(d.name || '')}</td>
      <td class="text-right">${fmtMoney(d.amount_per_share ?? 0, d.currency)}</td>
      <td class="text-right">${fmt(d.shares ?? 0)}</td>
      <td class="text-right positive">${fmtMoney(d.total_amount ?? 0, d.currency)}</td>
      <td><span class="muted text-sm">${escHtml(d.frequency || '')}</span></td>
      <td>${d.date ? fmtDate(d.date) : '–'}</td>
    </tr>`).join('')}
  </tbody></table></div>`;
}

function renderAnnualDivChart(annual) {
  const canvas = document.getElementById('annualDivChart');
  if (!canvas || !annual.length) return;
  if (state.charts.annualDiv) { state.charts.annualDiv.destroy(); state.charts.annualDiv = null; }
  const th = chartTheme();
  const currentYear = new Date().getFullYear();
  state.charts.annualDiv = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: annual.map(a => a.year === currentYear ? `${a.year} ${t('cal.current')}` : String(a.year)),
      datasets: [{
        label: t('chart.annual_div'),
        data: annual.map(a => a.total),
        backgroundColor: annual.map(a => a.year === currentYear ? 'rgba(99,102,241,.5)' : '#6366f1'),
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: th.tooltip.bg, borderColor: th.tooltip.border, borderWidth: 1,
          titleColor: th.text, bodyColor: th.text,
          callbacks: { label: ctx => ` ${fmtMoney(ctx.parsed.y)}` },
        },
      },
      scales: {
        x: { ticks: { color: th.text }, grid: { color: th.grid } },
        y: { ticks: { color: th.text, callback: v => fmtMoney(v) }, grid: { color: th.grid } },
      },
    },
  });
}

/* Div record modal */
let _divRecordData = {};
function openDivRecordModal(symbol, amount, date, currency) {
  _divRecordData = { symbol, amount, date, currency };
  const f = document.getElementById('txnForm');
  if (!f) return;
  document.getElementById('modalTitle').textContent = t('modal.add_txn');
  f.reset();
  f.txnType.value = 'dividend';
  updateFormFields('dividend');
  f.txnSymbol.value = symbol;
  f.txnDate.value = date;
  if (f.txnAmount) f.txnAmount.value = amount;
  if (f.txnCurrency) f.txnCurrency.value = currency || settings.currency;
  document.getElementById('txnModal')?.classList.remove('hidden');
}

function initRefreshCalendar() {
  document.getElementById('refreshCalendar')?.addEventListener('click', () => renderCalendarPage());
}

/* ══════════════════════════════════════════════════════════════
   Analytics Page
══════════════════════════════════════════════════════════════ */
async function renderAnalyticsPage() {
  const data = state.chartData;
  if (!data) return;
  renderDividendsChart(data.dividends || []);
  renderTypeChart(data.typeSummary || []);
  renderSectorCountryCharts();
}

function renderDividendsChart(dividends) {
  const canvas = document.getElementById('dividendsChart');
  if (!canvas || !dividends.length) return;
  if (state.charts.dividends) { state.charts.dividends.destroy(); state.charts.dividends = null; }
  const th = chartTheme();
  state.charts.dividends = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dividends.map(d => d.date),
      datasets: [{ label: t('chart.monthly_div'), data: dividends.map(d => d.value), backgroundColor: '#6366f1', borderRadius: 4 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: th.tooltip.bg, borderColor: th.tooltip.border, borderWidth: 1,
          titleColor: th.text, bodyColor: th.text,
          callbacks: { label: ctx => ` ${fmtMoney(ctx.parsed.y)}` },
        },
      },
      scales: {
        x: { ticks: { color: th.text, maxRotation: 45 }, grid: { color: th.grid } },
        y: { ticks: { color: th.text, callback: v => fmtMoney(v) }, grid: { color: th.grid } },
      },
    },
  });
}

function renderTypeChart(typeSummary) {
  const canvas = document.getElementById('typeChart');
  if (!canvas || !typeSummary.length) return;
  if (state.charts.typeChart) { state.charts.typeChart.destroy(); state.charts.typeChart = null; }
  const th = chartTheme();
  const labels = typeSummary.map(s => typeLabel(s.type));
  const data = typeSummary.map(s => Math.abs(s.total));
  state.charts.typeChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: PALETTE.slice(0, labels.length), borderWidth: 2, borderColor: 'transparent', hoverOffset: 8 }],
    },
    options: doughnutOptions(labels, th),
  });
}

async function renderSectorCountryCharts() {
  const holdings = state.portfolio?.holdings;
  if (!holdings || !holdings.length) return;

  const sectorMap = {}, countryMap = {};
  let sectorFetched = 0, countryFetched = 0;
  const statusSector = document.getElementById('sectorStatus');
  const statusCountry = document.getElementById('countryStatus');

  const promises = holdings.slice(0, 15).map(async h => {
    try {
      const q = await apiGet(`/api/quote/${encodeURIComponent(h.symbol)}`);
      if (q.sector) {
        sectorMap[q.sector] = (sectorMap[q.sector] || 0) + h.marketValue;
        sectorFetched++;
      }
      if (q.country) {
        countryMap[q.country] = (countryMap[q.country] || 0) + h.marketValue;
        countryFetched++;
      }
    } catch { /* ignore */ }
  });

  await Promise.allSettled(promises);

  if (Object.keys(sectorMap).length) buildPieChart('sectorChart', 'sector', sectorMap, statusSector, sectorFetched);
  if (Object.keys(countryMap).length) buildPieChart('countryChart', 'country', countryMap, statusCountry, countryFetched);
}

function buildPieChart(canvasId, chartKey, dataMap, statusEl, fetched) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (state.charts[chartKey]) { state.charts[chartKey].destroy(); state.charts[chartKey] = null; }
  const th = chartTheme();
  const sorted = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(([k]) => k);
  const data = sorted.map(([, v]) => v);
  state.charts[chartKey] = new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: PALETTE.slice(0, labels.length), borderWidth: 2, borderColor: 'transparent', hoverOffset: 8 }] },
    options: doughnutOptions(labels, th),
  });
  if (statusEl) statusEl.textContent = fetched < (state.portfolio?.holdings?.length || 0) ? `Based on ${fetched} of ${state.portfolio.holdings.length} holdings` : '';
}


/* ══════════════════════════════════════════════════════════════
   Settings Page
══════════════════════════════════════════════════════════════ */
function renderSettingsPage() {
  const cur = document.getElementById('setCurrency');
  const loc = document.getElementById('setLocale');
  const col = document.getElementById('setCollapsedDefault');
  if (cur) cur.value = settings.currency;
  if (loc) loc.value = settings.locale;
  if (col) col.checked = settings.sidebarCollapsed;
  updateSettingsPreview();
  renderPortfolioList();
}

function updateSettingsPreview() {
  const preview = document.getElementById('settingsPreview');
  if (!preview) return;
  const now = new Date();
  preview.innerHTML = `
    <div><span>Date:</span> ${fmtDate(now.toISOString())}</div>
    <div><span>Number:</span> ${fmt(1234567.89)}</div>
    <div><span>Currency:</span> ${fmtMoney(1234567.89)}</div>
  `;
}

function initSettingsPage() {
  const saveBtn = document.getElementById('saveSettingsBtn');
  const cur = document.getElementById('setCurrency');
  const loc = document.getElementById('setLocale');
  const col = document.getElementById('setCollapsedDefault');

  cur?.addEventListener('change', () => { settings.currency = cur.value; updateSettingsPreview(); });
  loc?.addEventListener('change', () => {
    settings.locale = loc.value;
    updateSettingsPreview();
    applyI18n();
    renderPortfolioList();
  });
  col?.addEventListener('change', () => {
    settings.sidebarCollapsed = col.checked;
    document.body.classList.toggle('sidebar-collapsed', col.checked);
  });

  saveBtn?.addEventListener('click', async () => {
    await saveSettings();
    showToast(t('toast.settings_saved'));
    applyI18n();
    if (state.portfolio) renderDashboard(state.portfolio);
    if (state.chartData?.invested) {
      renderPerformanceChart(state.chartData.invested, state.investedPeriod);
      renderPortfolioPerformanceChart(state.perfPeriod);
    }
  });

  // Portfolio creation from settings card
  document.getElementById('createPortfolioBtn')?.addEventListener('click', async () => {
    const nameEl = document.getElementById('newPortfolioName');
    const name = nameEl?.value.trim();
    if (!name) return;
    try {
      await createPortfolio(name);
      if (nameEl) nameEl.value = '';
      showToast(`Portfolio "${name}" created!`);
    } catch (e) { showToast(e.message, 'error'); }
  });
}

/* ══════════════════════════════════════════════════════════════
   Transaction Modal
══════════════════════════════════════════════════════════════ */
let _editTxnId = null;

function openAddModal() {
  _editTxnId = null;
  const f = document.getElementById('txnForm');
  if (!f) return;
  document.getElementById('modalTitle').textContent = t('modal.add_txn');
  f.reset();
  f.txnDate.value = new Date().toISOString().slice(0, 10);
  if (f.txnCurrency) f.txnCurrency.value = settings.currency;
  updateFormFields(f.txnType.value || 'buy');
  document.getElementById('txnModal')?.classList.remove('hidden');
}

function openEditModal(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;
  _editTxnId = id;
  const f = document.getElementById('txnForm');
  if (!f) return;
  document.getElementById('modalTitle').textContent = t('modal.edit_txn');
  f.txnType.value = tx.type;
  f.txnDate.value = tx.date ? tx.date.slice(0, 10) : '';
  f.txnSymbol.value = tx.symbol || '';
  f.txnName.value = tx.name || '';
  updateFormFields(tx.type);
  const qty = document.getElementById('txnQuantity');
  const price = document.getElementById('txnPrice');
  const amount = document.getElementById('txnAmount');
  const fees = document.getElementById('txnFees');
  const cur = document.getElementById('txnCurrency');
  const notes = document.getElementById('txnNotes');
  const split = document.getElementById('txnSplitRatio');
  if (qty) qty.value = tx.type !== 'split' ? (tx.quantity || '') : '';
  if (price) price.value = tx.price || '';
  if (amount) amount.value = tx.amount || '';
  if (fees) fees.value = tx.fees || '';
  if (cur) cur.value = tx.currency || settings.currency;
  if (notes) notes.value = tx.notes || '';
  if (split) split.value = tx.type === 'split' ? (tx.quantity || '') : '';
  document.getElementById('txnModal')?.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('txnModal')?.classList.add('hidden');
  _editTxnId = null;
}

function updateFormFields(type) {
  const show = id => { const el = document.getElementById(id); if (el) el.style.display = ''; };
  const hide = id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; };
  // Reset all conditional rows
  ['symbolRow', 'qtyRow', 'priceRow', 'feesRow', 'amountRow', 'splitRatioRow', 'divAmountRow'].forEach(hide);
  switch (type) {
    case 'buy': case 'sell':
      show('symbolRow'); show('qtyRow'); show('priceRow'); show('feesRow'); break;
    case 'split':
      show('symbolRow'); show('splitRatioRow'); break;
    case 'dividend':
      show('symbolRow'); show('divAmountRow'); break;
    case 'interest_earning': case 'deposit': case 'withdrawal': case 'tax':
      show('amountRow'); break;
  }
}

async function submitTxnForm(e) {
  e.preventDefault();
  const f = document.getElementById('txnForm');
  const type = f.txnType.value;
  const body = {
    type,
    date: f.txnDate.value,
    symbol: f.txnSymbol?.value.toUpperCase() || '',
    name: f.txnName?.value || '',
    quantity: type === 'split'
      ? (parseFloat(document.getElementById('txnSplitRatio')?.value) || 0)
      : (parseFloat(document.getElementById('txnQuantity')?.value) || 0),
    price: parseFloat(document.getElementById('txnPrice')?.value) || 0,
    amount: parseFloat(document.getElementById('txnAmount')?.value) || parseFloat(document.getElementById('txnDivAmount')?.value) || 0,
    fees: parseFloat(document.getElementById('txnFees')?.value) || 0,
    currency: document.getElementById('txnCurrency')?.value || settings.currency,
    notes: document.getElementById('txnNotes')?.value || '',
    portfolio_id: pid(),
  };

  try {
    if (_editTxnId) {
      await apiPut(`/api/transactions/${_editTxnId}`, body);
      showToast(t('toast.txn_updated'));
    } else {
      await apiPost('/api/transactions', body);
      showToast(t('toast.txn_added'));
    }
    closeModal();
    await loadAll();
  } catch (err) { showToast(err.message, 'error'); }
}

function initModal() {
  document.getElementById('txnForm')?.addEventListener('submit', submitTxnForm);
  document.getElementById('addTxnBtn')?.addEventListener('click', openAddModal);
  document.getElementById('addTxnBtnHoldings')?.addEventListener('click', openAddModal);
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalCancelBtn')?.addEventListener('click', closeModal);
  document.getElementById('txnModal')?.addEventListener('click', e => {
    if (e.target.id === 'txnModal') closeModal();
  });

  const typeSelect = document.getElementById('txnType');
  typeSelect?.addEventListener('change', () => {
    updateFormFields(typeSelect.value);
    // Update labels
    const typeKey = typeSelect.value;
    const symLbl = document.getElementById('labelSymbol');
    if (symLbl) symLbl.textContent = t('form.symbol');
  });
}

/* ══════════════════════════════════════════════════════════════
   Stock search (topbar + modal)
══════════════════════════════════════════════════════════════ */
function initStockSearch() {
  setupSearch('stockSearch', 'stockResults', symbol => {
    // Show holding detail
    showPage('holdings');
    loadHoldingDetail(symbol);
  });

  setupSearch('txnSymbol', 'txnSymbolResults', (symbol, name) => {
    const f = document.getElementById('txnForm');
    if (f) {
      f.txnSymbol.value = symbol;
      if (f.txnName) f.txnName.value = name;
    }
  });
}

function initBenchmarkSearch() {
  const input = document.getElementById('benchmarkInput');
  const results = document.getElementById('benchmarkResults');
  if (!input) return;

  input.value = state.benchmarkSymbol;

  let _timer;
  input.addEventListener('input', () => {
    clearTimeout(_timer);
    const q = input.value.trim();
    if (!q) { results?.classList.add('hidden'); return; }
    _timer = setTimeout(async () => {
      try {
        const list = await apiGet(`/api/search?q=${encodeURIComponent(q)}`);
        if (!results) return;
        if (!list.length) { results.classList.add('hidden'); return; }
        results.innerHTML = list.slice(0, 6).map(r =>
          `<li data-symbol="${escHtml(r.symbol)}" data-name="${escHtml(r.name || '')}">${escHtml(r.symbol)} <span class="text-muted text-sm">${escHtml(r.name || '')}</span></li>`
        ).join('');
        results.classList.remove('hidden');
        results.querySelectorAll('li').forEach(li => {
          li.addEventListener('click', () => {
            state.benchmarkSymbol = li.dataset.symbol;
            input.value = li.dataset.symbol;
            results.classList.add('hidden');
            renderPortfolioPerformanceChart(state.perfPeriod);
          });
        });
      } catch { /* ignore */ }
    }, 350);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      state.benchmarkSymbol = input.value.trim().toUpperCase();
      results?.classList.add('hidden');
      renderPortfolioPerformanceChart(state.perfPeriod);
    }
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target)) results?.classList.add('hidden');
  });
}

function setupSearch(inputId, listId, onSelect) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  if (!input || !list) return;
  let _timer;
  input.addEventListener('input', () => {
    clearTimeout(_timer);
    const q = input.value.trim();
    if (q.length < 1) { list.classList.add('hidden'); return; }
    _timer = setTimeout(async () => {
      try {
        const results = await apiGet(`/api/search?q=${encodeURIComponent(q)}`);
        if (!results.length) { list.classList.add('hidden'); return; }
        list.innerHTML = results.slice(0, 8).map(r =>
          `<li data-symbol="${escHtml(r.symbol)}" data-name="${escHtml(r.name || '')}">${escHtml(r.symbol)} <span class="text-muted text-sm">${escHtml(r.name || '')}</span></li>`
        ).join('');
        list.classList.remove('hidden');
        list.querySelectorAll('li').forEach(li => {
          li.addEventListener('mousedown', e => {
            e.preventDefault();
            onSelect(li.dataset.symbol, li.dataset.name);
            list.classList.add('hidden');
            input.value = li.dataset.symbol;
          });
        });
      } catch { /* ignore */ }
    }, 300);
  });
  input.addEventListener('blur', () => setTimeout(() => list.classList.add('hidden'), 200));
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') list.classList.add('hidden');
  });
}

/* ══════════════════════════════════════════════════════════════
   Theme toggle
══════════════════════════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem('wf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  function update(theme) {
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    if (label) label.textContent = theme === 'dark' ? t('theme.dark') : t('theme.light');
  }
  update(saved);
  btn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('wf_theme', next);
    update(next);
    // Re-render charts with new theme
    if (state.portfolio) {
      renderAllocationChart(state.portfolio.holdings, state.portfolio.summary?.cashBalance);
    }
    if (state.chartData?.invested) {
      renderPerformanceChart(state.chartData.invested, state.investedPeriod);
      renderPortfolioPerformanceChart(state.perfPeriod);
    }
    renderAnalyticsPage();
  });
}

/* ══════════════════════════════════════════════════════════════
   Rename Portfolio Modal
══════════════════════════════════════════════════════════════ */
function initRenameModal() {
  document.getElementById('renamePortfolioClose')?.addEventListener('click', closeRenameModal);
  document.getElementById('renamePortfolioCancelBtn')?.addEventListener('click', closeRenameModal);
  document.getElementById('renamePortfolioSaveBtn')?.addEventListener('click', saveRenamePortfolio);
  document.getElementById('renamePortfolioOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'renamePortfolioOverlay') closeRenameModal();
  });
  document.getElementById('renamePortfolioInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveRenamePortfolio();
  });
}

/* ══════════════════════════════════════════════════════════════
   Data Loading
══════════════════════════════════════════════════════════════ */
async function loadAll() {
  try {
    const [portfolioData, transactions, chartData] = await Promise.all([
      apiGet(`/api/portfolio?portfolio_id=${pid()}`),
      apiGet(`/api/transactions?portfolio_id=${pid()}`),
      apiGet(`/api/charts?portfolio_id=${pid()}`),
    ]);
    state.portfolio = portfolioData;
    state.transactions = transactions || [];
    state.chartData = chartData;

    renderDashboard(portfolioData);
    renderRecentTransactions(state.transactions);
    renderTransactionsTable(state.transactions);

    if (chartData.invested) {
      renderPerformanceChart(chartData.invested, state.investedPeriod);
      renderPortfolioPerformanceChart(state.perfPeriod);
    }

    // Update filter options with translated labels
    const filterSel = document.getElementById('filterType');
    if (filterSel && _txnFilterType) {
      filterSel.value = _txnFilterType;
      const filtered = state.transactions.filter(t => t.type === _txnFilterType);
      renderTransactionsTable(filtered);
    }
  } catch (e) {
    console.error(e);
    showToast(t('toast.load_error'), 'error');
  }
}

/* ══════════════════════════════════════════════════════════════
   Portfolio Switcher toggle
══════════════════════════════════════════════════════════════ */
function initPortfolioSwitcher() {
  document.getElementById('portfolioCurrent')?.addEventListener('click', openPortfolioDropdown);
  document.addEventListener('click', e => {
    if (!document.getElementById('portfolioSwitcher')?.contains(e.target)) {
      closePortfolioDropdown();
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   Bootstrap
══════════════════════════════════════════════════════════════ */
async function init() {
  await loadSettings();
  applyI18n();
  initTheme();
  initNav();
  initSidebar();
  initModal();
  initStockSearch();
  initTransactionFilter();
  initCsv();
  initHoldingSearch();
  initRefreshHoldings();
  initRefreshCalendar();
  initSettingsPage();
  initPeriodButtons();
  initPortfolioSwitcher();
  initRenameModal();
  initBenchmarkSearch();

  showPage('dashboard');
  renderSettingsPage();

  await loadPortfolios();
  await loadAll();
}

document.addEventListener('DOMContentLoaded', init);

