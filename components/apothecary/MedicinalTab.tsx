"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, Pill, Flask, Book, Leaf, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface MedicinalTabProps {
  plantId: string;
}

interface MedicinalInfo {
  id: string;
  properties: string[];
  traditionalUses: string[];
  modernUses: string[];
  activeCompounds: string[];
  preparations: string[];
  dosage?: string;
  safetyWarnings: string[];
  contraindications: string[];
  drugInteractions: string[];
  references: string[];
}

export default function MedicinalTab({ plantId }: MedicinalTabProps) {
  const [medicinalInfo, setMedicinalInfo] = useState<MedicinalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicinalInfo();
  }, [plantId]);

  const fetchMedicinalInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/apothecary/plants/${plantId}`
      );

      if (response.status === 404) {
        setError('No medicinal information available for this plant yet.');
        setMedicinalInfo(null);
      } else if (!response.ok) {
        throw new Error('Failed to fetch medicinal information');
      } else {
        const data = await response.json();
        setMedicinalInfo(data);
      }
    } catch (err) {
      console.error('Error fetching medicinal info:', err);
      setError('Failed to load medicinal information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !medicinalInfo) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="py-12 text-center">
          <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500 mb-2">
            {error || 'No medicinal information available'}
          </p>
          <p className="text-sm text-gray-400">
            This plant may not have documented medicinal uses or the information hasn't been added yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Safety Warnings */}
      {(medicinalInfo.safetyWarnings.length > 0 ||
        medicinalInfo.contraindications.length > 0 ||
        medicinalInfo.drugInteractions.length > 0) && (
        <Card className="border-l-4 border-amber-500 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-6 h-6" />
              Safety Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicinalInfo.safetyWarnings.length > 0 && (
              <div>
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Warnings
                </h4>
                <ul className="space-y-1">
                  {medicinalInfo.safetyWarnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-amber-800 flex gap-2">
                      <span>•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {medicinalInfo.contraindications.length > 0 && (
              <div>
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Contraindications
                </h4>
                <ul className="space-y-1">
                  {medicinalInfo.contraindications.map((contra, idx) => (
                    <li key={idx} className="text-sm text-amber-800 flex gap-2">
                      <span>•</span>
                      <span>{contra}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {medicinalInfo.drugInteractions.length > 0 && (
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">
                  Drug Interactions
                </h4>
                <ul className="space-y-1">
                  {medicinalInfo.drugInteractions.map((interaction, idx) => (
                    <li key={idx} className="text-sm text-amber-800 flex gap-2">
                      <span>•</span>
                      <span>{interaction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Medicinal Properties */}
      {medicinalInfo.properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-6 h-6 text-emerald-600" />
              Medicinal Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {medicinalInfo.properties.map((prop, idx) => (
                <Badge
                  key={idx}
                  className="bg-emerald-100 text-emerald-700 text-sm py-1 px-3"
                >
                  {prop}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Compounds */}
      {medicinalInfo.activeCompounds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flask className="w-6 h-6 text-purple-600" />
              Active Compounds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {medicinalInfo.activeCompounds.map((compound, idx) => (
                <Badge
                  key={idx}
                  className="bg-purple-100 text-purple-700 text-sm py-1 px-3"
                >
                  {compound}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traditional Uses */}
      {medicinalInfo.traditionalUses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-6 h-6 text-blue-600" />
              Traditional Uses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medicinalInfo.traditionalUses.map((use, idx) => (
                <li key={idx} className="text-gray-700 flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Modern Uses */}
      {medicinalInfo.modernUses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Modern Uses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medicinalInfo.modernUses.map((use, idx) => (
                <li key={idx} className="text-gray-700 flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Preparations & Dosage */}
      {(medicinalInfo.preparations.length > 0 || medicinalInfo.dosage) && (
        <Card>
          <CardHeader>
            <CardTitle>Preparations & Dosage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicinalInfo.preparations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Common Preparations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {medicinalInfo.preparations.map((prep, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-sm py-1 px-3"
                    >
                      {prep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {medicinalInfo.dosage && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Typical Dosage
                </h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {medicinalInfo.dosage}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* References */}
      {medicinalInfo.references.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-1 list-decimal list-inside text-xs text-gray-600">
              {medicinalInfo.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
