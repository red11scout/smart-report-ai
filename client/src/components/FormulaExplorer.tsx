import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Calculator,
  Loader2,
  Play,
  Save,
  ChevronRight,
  Variable,
  FunctionSquare,
  History,
  Plus,
  Check,
} from "lucide-react";

interface FormulaVersion {
  id: string;
  label: string;
  expression: string;
  description?: string;
  isActive: boolean;
  constants?: { key: string; label: string; value: number; description?: string }[];
  createdAt?: string;
  createdBy?: string;
}

interface AvailableInput {
  label: string;
  category: string;
  unit: string;
  description: string;
}

interface FormulaExplorerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldKey: string;
  fieldLabel: string;
  useCaseId?: string;
  useCaseName?: string;
  context: Record<string, number>;
  onFormulaChange?: (newResult: string) => void;
}

export function FormulaExplorer({
  open,
  onOpenChange,
  fieldKey,
  fieldLabel,
  useCaseId,
  useCaseName,
  context,
  onFormulaChange,
}: FormulaExplorerProps) {
  const { toast } = useToast();
  const [expression, setExpression] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [formulas, setFormulas] = useState<FormulaVersion[]>([]);
  const [activeFormula, setActiveFormula] = useState<FormulaVersion | null>(null);
  const [availableInputs, setAvailableInputs] = useState<Record<string, Record<string, AvailableInput>>>({});
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [constants, setConstants] = useState<{ key: string; label: string; value: number; description?: string }[]>([]);
  const [activeTab, setActiveTab] = useState("editor");

  // Fetch formulas and available inputs when dialog opens
  useEffect(() => {
    if (open && fieldKey) {
      fetchFormulas();
    }
  }, [open, fieldKey, useCaseId]);

  async function fetchFormulas() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ fieldKey });
      if (useCaseId) params.set("useCaseId", useCaseId);

      const res = await fetch(`/api/formulas?${params}`);
      if (!res.ok) throw new Error("Failed to fetch formulas");

      const data = await res.json();
      setFormulas(data.formulas || []);
      setActiveFormula(data.activeFormula || null);
      setAvailableInputs(data.availableInputs || {});

      // Pre-populate editor with active formula
      if (data.activeFormula) {
        setExpression(data.activeFormula.expression);
        setLabel(data.activeFormula.label);
        setDescription(data.activeFormula.description || "");
        setConstants(data.activeFormula.constants || []);
      } else {
        setExpression("");
        setLabel(`${fieldLabel} Formula`);
        setDescription("");
        setConstants([]);
      }
    } catch (err) {
      console.error("Error fetching formulas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePreview() {
    if (!expression.trim()) return;
    setPreviewing(true);
    setPreviewError(null);
    setPreviewResult(null);

    try {
      const res = await fetch("/api/formulas/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression, context, constants }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPreviewError(data.error || "Preview failed");
        return;
      }
      setPreviewResult(String(data.result ?? data.value ?? "N/A"));
    } catch (err) {
      setPreviewError("Failed to evaluate formula");
    } finally {
      setPreviewing(false);
    }
  }

  async function handleSave() {
    if (!expression.trim() || !label.trim()) {
      toast({ title: "Error", description: "Label and expression are required.", variant: "destructive" });
      return;
    }
    setSaving(true);

    try {
      const res = await fetch("/api/formulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldKey,
          useCaseId: useCaseId || null,
          label,
          expression,
          description,
          constants,
          isActive: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Invalid Formula", description: err.error || "Could not save formula.", variant: "destructive" });
        return;
      }

      const saved = await res.json();
      toast({ title: "Formula Saved", description: `"${saved.label}" is now active.` });
      onFormulaChange?.(previewResult || "updated");
      fetchFormulas();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save formula.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(formulaId: string) {
    try {
      const res = await fetch(`/api/formulas/${formulaId}/activate`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      toast({ title: "Formula Activated" });
      fetchFormulas();
    } catch {
      toast({ title: "Error", description: "Failed to activate formula.", variant: "destructive" });
    }
  }

  function insertVariable(varName: string) {
    setExpression((prev) => (prev ? `${prev} ${varName}` : varName));
  }

  function addConstant() {
    setConstants((prev) => [
      ...prev,
      { key: `const_${prev.length + 1}`, label: "New Constant", value: 0 },
    ]);
  }

  function updateConstant(index: number, field: string, value: any) {
    setConstants((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function removeConstant(index: number) {
    setConstants((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FunctionSquare className="h-5 w-5 text-purple-600" />
            Formula Explorer
          </DialogTitle>
          <DialogDescription>
            {fieldLabel}
            {useCaseName && (
              <Badge variant="outline" className="ml-2 text-xs">
                {useCaseName}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="editor" className="flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="variables" className="flex items-center gap-1.5">
                <Variable className="h-3.5 w-3.5" />
                Variables
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                Versions ({formulas.length})
              </TabsTrigger>
            </TabsList>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="formula-label">Label</Label>
                  <Input
                    id="formula-label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., Standard ROI Calculation"
                  />
                </div>

                <div>
                  <Label htmlFor="formula-expression">Expression</Label>
                  <div className="relative">
                    <textarea
                      id="formula-expression"
                      value={expression}
                      onChange={(e) => {
                        setExpression(e.target.value);
                        setPreviewResult(null);
                        setPreviewError(null);
                      }}
                      placeholder="e.g., (totalAnnualImpact * probabilityOfSuccess / 100) - implementationCost"
                      className="w-full min-h-[80px] p-3 font-mono text-sm border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Use variable names from the Variables tab. Supported functions: max, min, abs, floor, ceil, round, sqrt, pow, log.
                  </p>
                </div>

                <div>
                  <Label htmlFor="formula-description">Description (optional)</Label>
                  <Input
                    id="formula-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain what this formula calculates"
                  />
                </div>

                {/* Constants */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Constants</Label>
                    <Button variant="ghost" size="sm" onClick={addConstant} className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Add Constant
                    </Button>
                  </div>
                  {constants.length > 0 && (
                    <div className="space-y-2">
                      {constants.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={c.key}
                            onChange={(e) => updateConstant(i, "key", e.target.value)}
                            placeholder="key"
                            className="w-28 text-xs font-mono"
                          />
                          <Input
                            value={c.label}
                            onChange={(e) => updateConstant(i, "label", e.target.value)}
                            placeholder="Label"
                            className="flex-1 text-xs"
                          />
                          <Input
                            type="number"
                            value={c.value}
                            onChange={(e) => updateConstant(i, "value", parseFloat(e.target.value) || 0)}
                            className="w-24 text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeConstant(i)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview Area */}
                <Card className="border-dashed">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Preview Result</p>
                        {previewResult !== null && (
                          <p className="text-xl font-bold text-slate-900">{previewResult}</p>
                        )}
                        {previewError && (
                          <p className="text-sm text-red-600">{previewError}</p>
                        )}
                        {previewResult === null && !previewError && (
                          <p className="text-sm text-slate-400">Click "Run Preview" to evaluate</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreview}
                        disabled={previewing || !expression.trim()}
                      >
                        {previewing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                        ) : (
                          <Play className="h-3.5 w-3.5 mr-1" />
                        )}
                        Run Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Context values */}
                {Object.keys(context).length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Current Context Values</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(context).map(([key, val]) => (
                        <Badge key={key} variant="outline" className="text-[10px] font-mono">
                          {key}: {typeof val === "number" ? val.toLocaleString() : val}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Variables Tab */}
            <TabsContent value="variables" className="space-y-4">
              {Object.entries(availableInputs).length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No available inputs found.</p>
              ) : (
                Object.entries(availableInputs).map(([category, inputs]) => (
                  <Card key={category}>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-4 pb-3">
                      <div className="space-y-1.5">
                        {Object.entries(inputs).map(([key, input]) => (
                          <button
                            key={key}
                            onClick={() => {
                              insertVariable(key);
                              setActiveTab("editor");
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors text-left group"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <code className="text-xs font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                  {key}
                                </code>
                                <span className="text-xs text-slate-600 truncate">{input.label}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{input.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <Badge variant="outline" className="text-[10px]">{input.unit}</Badge>
                              <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-purple-500 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-3">
              {formulas.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">
                  No formula versions yet. Create one in the Editor tab.
                </p>
              ) : (
                formulas.map((f) => (
                  <Card
                    key={f.id}
                    className={`cursor-pointer transition-all ${
                      f.isActive ? "border-purple-300 bg-purple-50/50" : "hover:border-slate-300"
                    }`}
                    onClick={() => {
                      setExpression(f.expression);
                      setLabel(f.label);
                      setDescription(f.description || "");
                      setConstants(f.constants || []);
                      setPreviewResult(null);
                      setPreviewError(null);
                      setActiveTab("editor");
                    }}
                  >
                    <CardContent className="py-3 px-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-800">{f.label}</span>
                            {f.isActive && (
                              <Badge className="bg-purple-600 text-[10px]">Active</Badge>
                            )}
                          </div>
                          <code className="text-xs font-mono text-slate-500 block truncate">
                            {f.expression}
                          </code>
                          {f.createdAt && (
                            <p className="text-[10px] text-slate-400 mt-1">
                              {new Date(f.createdAt).toLocaleDateString()} by {f.createdBy || "user"}
                            </p>
                          )}
                        </div>
                        {!f.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivate(f.id);
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" /> Activate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !expression.trim() || !label.trim()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            Save Formula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
