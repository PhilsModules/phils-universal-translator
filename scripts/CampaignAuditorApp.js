import { 
    MODULE_ID, 
    auditCampaignIntegrity, 
    repairAllBackupConflicts, 
    repairAllWorldBackupLinks, 
    repairAllMojibakeWorldWide,
    restoreDocumentFromBackup
} from './TranslationLogic.js';
import { TranslationStudioApp } from './TranslationStudioApp.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * CampaignAuditorApp
 * Scans the entire active Foundry campaign, validates text completeness,
 * detects missing chunks, broken backup links, and Mojibake artifacts,
 * and provides 1-click automatic repair operations.
 */
export class CampaignAuditorApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "universal-campaign-auditor",
        classes: ["universal-ts-window", "universal-auditor-window"],
        tag: "div",
        window: {
            title: "Universal Kampagnen-Auditor & Integritäts-Prüfer",
            icon: "fas fa-shield-halved",
            resizable: true
        },
        position: {
            width: 860,
            height: 740
        },
        actions: {
            refreshAudit: CampaignAuditorApp.onRefreshAudit,
            repairBackups: CampaignAuditorApp.onRepairBackups,
            repairLinks: CampaignAuditorApp.onRepairLinks,
            repairMojibake: CampaignAuditorApp.onRepairMojibake,
            openStudioForJournal: CampaignAuditorApp.onOpenStudioForJournal,
            restoreJournal: CampaignAuditorApp.onRestoreJournal,
            filterCategory: CampaignAuditorApp.onFilterCategory
        }
    };

    static PARTS = {
        main: {
            template: `modules/${MODULE_ID}/templates/campaign-auditor.hbs`
        }
    };

    constructor(options = {}) {
        super(options);
        this.auditData = null;
        this.activeFilter = 'all'; // 'all', 'error', 'warning', 'mojibake'
        this.isScanning = false;
    }

    async _prepareContext(_options) {
        if (!this.auditData && !this.isScanning) {
            this.isScanning = true;
            this.auditData = await auditCampaignIntegrity();
            this.isScanning = false;
        }

        const audit = this.auditData || {
            totalJournals: 0,
            totalCheckedPages: 0,
            intactCount: 0,
            warningCount: 0,
            errorCount: 0,
            overallHealth: 100,
            backupHijacks: [],
            chunkLossIssues: [],
            brokenLinkIssues: [],
            mojibakeIssues: [],
            journalAudits: []
        };

        let healthColor = "green";
        let healthIcon = "fa-circle-check";
        let healthLabel = "Hervorragend (100% Intakt)";

        if (audit.overallHealth < 60 || audit.errorCount > 0) {
            healthColor = "red";
            healthIcon = "fa-triangle-exclamation";
            healthLabel = "Kritische Probleme gefunden";
        } else if (audit.overallHealth < 85 || audit.warningCount > 0) {
            healthColor = "yellow";
            healthIcon = "fa-circle-exclamation";
            healthLabel = "Warnungen vorhanden";
        }

        let filteredJournals = (audit.journalAudits || []).map(j => {
            let pages = j.pageAudits || [];
            if (this.activeFilter === 'error') {
                pages = pages.filter(p => p.status === 'error');
            } else if (this.activeFilter === 'warning') {
                pages = pages.filter(p => p.status === 'warning' || p.status === 'error');
            } else if (this.activeFilter === 'mojibake') {
                pages = pages.filter(p => p.issues && p.issues.some(i => i.includes('Umlaute')));
            }
            return {
                ...j,
                pageAudits: pages,
                hasVisiblePages: pages.length > 0
            };
        }).filter(j => this.activeFilter === 'all' || j.hasVisiblePages);

        return {
            audit: audit,
            healthColor: healthColor,
            healthIcon: healthIcon,
            healthLabel: healthLabel,
            filteredJournals: filteredJournals,
            activeFilter: this.activeFilter,
            filterAllActive: this.activeFilter === 'all',
            filterWarningActive: this.activeFilter === 'warning',
            filterErrorActive: this.activeFilter === 'error',
            filterMojibakeActive: this.activeFilter === 'mojibake'
        };
    }

    static async onRefreshAudit(event, target) {
        this.auditData = await auditCampaignIntegrity();
        ui.notifications.info("Kampagnen-Audit erfolgreich aktualisiert.");
        this.render(false);
    }

    static async onRepairBackups(event, target) {
        await repairAllBackupConflicts();
        ui.notifications.success("Alle Backups wurden erfolgreich geprüft und abgesichert.");
        this.auditData = await auditCampaignIntegrity();
        this.render(false);
    }

    static async onRepairLinks(event, target) {
        const res = await repairAllWorldBackupLinks();
        ui.notifications.success(`${res.totalLinksRemapped} Verlinkungen erfolgreich auf Welt-Dokumente umgebogen.`);
        this.auditData = await auditCampaignIntegrity();
        this.render(false);
    }

    static async onRepairMojibake(event, target) {
        const count = await repairAllMojibakeWorldWide();
        ui.notifications.success(`${count} Umlaute- und Kodierungsfehler erfolgreich in allen Journalen repariert.`);
        this.auditData = await auditCampaignIntegrity();
        this.render(false);
    }

    static async onOpenStudioForJournal(event, target) {
        const journalId = target.dataset.journalId;
        const journal = game.journal?.get(journalId);
        if (journal) {
            new TranslationStudioApp({ document: journal }).render(true);
        }
    }

    static async onRestoreJournal(event, target) {
        const journalId = target.dataset.journalId;
        const journal = game.journal?.get(journalId);
        if (journal) {
            Dialog.confirm({
                title: `Journal wiederherstellen: ${journal.name}`,
                content: `<p>Möchtest du das Journal <strong>"${journal.name}"</strong> auf den letzten Sicherheits-Backup-Stand zurücksetzen?</p>`,
                yes: async () => {
                    await restoreDocumentFromBackup(journal);
                    this.auditData = await auditCampaignIntegrity();
                    this.render(false);
                }
            });
        }
    }

    static onFilterCategory(event, target) {
        const filter = target.dataset.filter || 'all';
        this.activeFilter = filter;
        this.render(false);
    }
}
