import { useState } from 'react';
import { ArrowRightLeft, Calculator } from 'lucide-react';

export function UnitConverter() {
  const [value, setValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('newton');
  const [toUnit, setToUnit] = useState<string>('kgcm2');

  const units = [
    { value: 'newton', label: 'Newton (N)', symbol: 'N' },
    { value: 'kgcm2', label: 'Kilogram per cm² (kg/cm²)', symbol: 'kg/cm²' },
    { value: 'ncm2', label: 'Newton per cm² (N/cm²)', symbol: 'N/cm²' },
    { value: 'pound', label: 'Pound-force (lbf)', symbol: 'lbf' },
    { value: 'kpa', label: 'Kilopascal (kPa)', symbol: 'kPa' },
    { value: 'psi', label: 'Pounds per square inch (PSI)', symbol: 'PSI' },
  ];

  const convertUnits = (inputValue: number, from: string, to: string): number => {
    // First convert to Newton (base unit)
    let valueInNewton = inputValue;
    
    switch (from) {
      case 'newton':
        valueInNewton = inputValue;
        break;
      case 'kgcm2':
        valueInNewton = inputValue * 9.80665; // 1 kg/cm² = 9.80665 N
        break;
      case 'ncm2':
        valueInNewton = inputValue; // For algometer readings, often 1 N/cm² ≈ 1 N for small probe areas
        break;
      case 'pound':
        valueInNewton = inputValue * 4.44822; // 1 lbf = 4.44822 N
        break;
      case 'kpa':
        valueInNewton = inputValue * 0.1; // 1 kPa ≈ 0.1 N (for 1 cm² area)
        break;
      case 'psi':
        valueInNewton = inputValue * 0.689476; // 1 PSI ≈ 0.689476 N (for 1 cm² area)
        break;
    }

    // Then convert from Newton to target unit
    switch (to) {
      case 'newton':
        return valueInNewton;
      case 'kgcm2':
        return valueInNewton / 9.80665;
      case 'ncm2':
        return valueInNewton;
      case 'pound':
        return valueInNewton / 4.44822;
      case 'kpa':
        return valueInNewton / 0.1;
      case 'psi':
        return valueInNewton / 0.689476;
      default:
        return valueInNewton;
    }
  };

  const getConvertedValue = (): string => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '0.00';
    const result = convertUnits(numValue, fromUnit, toUnit);
    return result.toFixed(2);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const quickConversions = [
    { from: 10, unit: 'newton', description: 'Light pressure threshold' },
    { from: 25, unit: 'newton', description: 'Normal pain threshold' },
    { from: 40, unit: 'newton', description: 'High pain tolerance' },
    { from: 2.5, unit: 'kgcm2', description: 'Typical algometer reading' },
  ];

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Unit Converter</h1> */}
        <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Unit Converter</h2>
        {/* <p className="text-gray-600 mt-1">Convert between different pressure measurement units used in algometry</p> */}
      </div>

      {/* Converter Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          {/* From Unit */}
          <div>
            <label className="block text-gray-700 mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
            >
              <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            </button>
          </div>

          {/* To Unit */}
          <div>
            <label className="block text-gray-700 mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900">
                {getConvertedValue()} {units.find(u => u.value === toUnit)?.symbol}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Quick Reference Conversions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickConversions.map((conv, index) => {
            const fromUnitLabel = units.find(u => u.value === conv.unit)?.symbol || '';
            const toN = convertUnits(conv.from, conv.unit, 'newton');
            const toKgCm2 = convertUnits(conv.from, conv.unit, 'kgcm2');
            const toNCm2 = convertUnits(conv.from, conv.unit, 'ncm2');
            
            return (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 mb-2">{conv.description}</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>{conv.from} {fromUnitLabel} = {toN.toFixed(2)} N</p>
                  <p>{conv.from} {fromUnitLabel} = {toKgCm2.toFixed(2)} kg/cm²</p>
                  <p>{conv.from} {fromUnitLabel} = {toNCm2.toFixed(2)} N/cm²</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Info */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-blue-900 mb-3">Understanding Algometer Units</h3>
        <div className="space-y-2 text-blue-800 text-sm">
          <p>• <span className="font-semibold">Newton (N)</span>: The SI unit of force. Commonly used in research settings.</p>
          <p>• <span className="font-semibold">kg/cm²</span>: Traditional unit used in many clinical algometers. 1 kg/cm² ≈ 9.81 N</p>
          <p>• <span className="font-semibold">N/cm²</span>: Pressure unit that accounts for probe tip area. Most accurate for comparing readings.</p>
          <p>• <span className="font-semibold">kPa (Kilopascal)</span>: Alternative pressure unit. 1 kPa = 1000 Pa</p>
          <p>• <span className="font-semibold">Normal pain threshold</span>: Typically ranges from 20-40 N depending on body location</p>
        </div>
      </div>
    </div>
  );
}
