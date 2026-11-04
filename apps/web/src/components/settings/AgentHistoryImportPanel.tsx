import { useState } from "react";
import { type EnvironmentId } from "@t3tools/contracts";
import { useEnvironments, usePrimaryEnvironment } from "../../state/environments";
import { useProjectScans } from "../../onboarding/useProjectScans";
import { ImportStep, type ImportSelection } from "../onboarding/WelcomeWizard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toastManager } from "../ui/toast";

export function AgentHistoryImportPanel({
  environmentId,
}: {
  readonly environmentId: EnvironmentId | null;
}) {
  const primary = usePrimaryEnvironment();
  const { environments } = useEnvironments();
  const target = environmentId ?? primary?.environmentId;
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState("");
  const [scannedFolder, setScannedFolder] = useState("");
  const [selection, setSelection] = useState<ImportSelection | null>(null);
  const [importing, setImporting] = useState(false);
  const scans = useProjectScans(open && scannedFolder && target ? [target] : []);
  return (
    <div className="p-4 space-y-3">
      <Button variant="outline" disabled={!target || importing} onClick={() => setOpen(!open)}>
        Import Claude / Codex conversations
      </Button>
      {open ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter the project folder on the selected computer. History is read from that computer's
            configured Claude Code and Codex homes. Existing conversations are skipped; older
            sessions are included subject to scan and import limits.
          </p>
          <p className="text-sm">
            Computer:{" "}
            {environments.find((item) => item.environmentId === target)?.label ??
              "Selected computer"}
          </p>
          <Input
            aria-label="Project folder for conversation import"
            placeholder="D:\Projects\my-project"
            value={folder}
            disabled={importing}
            onChange={(event) => setFolder(event.target.value)}
          />
          <Button
            disabled={!folder.trim() || importing}
            onClick={() => {
              setSelection(null);
              setScannedFolder(folder.trim());
              for (const scan of scans) scan.refresh();
            }}
          >
            Find conversations
          </Button>
          {scannedFolder ? (
            <ImportStep
              key={`${target}:${scannedFolder}`}
              projectFolder={scannedFolder}
              includeOlder
              scans={scans}
              importSelection={selection}
              onImportSelectionChange={setSelection}
              isImporting={importing}
              setIsImporting={setImporting}
              onDone={async (_project, warning, count = 0) => {
                toastManager.add({
                  type: warning ? "warning" : "success",
                  title: warning || `Imported ${count} conversations`,
                });
                setImporting(false);
                setScannedFolder("");
                setSelection(null);
                return true;
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
