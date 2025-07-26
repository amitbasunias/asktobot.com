import React, { useState, useEffect } from 'react';
import ChatBot from '../../../utils/ExclusiveChat';
import Loader from '../../../utils/Loader';
const finishLevels = {
  1: {
    coats: 1,
    compoundFactor: 0.3,
    description: 'Fire taping only - joints and fasteners covered',
    laborFactor: 0.3,
  },
  2: {
    coats: 2,
    compoundFactor: 0.5,
    description: 'Garage quality - wiped smooth, no tool marks',
    laborFactor: 0.5,
  },
  3: {
    coats: 2,
    compoundFactor: 0.7,
    description: 'Texture ready - smooth finish, ready for texture',
    laborFactor: 0.7,
  },
  4: {
    coats: 3,
    compoundFactor: 1.0,
    description: 'Paint ready - smooth finish, no imperfections',
    laborFactor: 1.0,
  },
  5: {
    coats: 4,
    compoundFactor: 1.3,
    description: 'Premium finish - skim coat over entire surface',
    laborFactor: 1.3,
  },
};

const compoundTypes = {
  all_purpose: {
    coverage: 100,
    price: 15,
    dryTime: 24,
    description: 'Versatile compound for all applications',
  },
  topping: {
    coverage: 120,
    price: 18,
    dryTime: 24,
    description: 'Smooth finish compound for final coats',
  },
  taping: {
    coverage: 80,
    price: 12,
    dryTime: 24,
    description: 'Strong compound for embedding tape',
  },
  lightweight: {
    coverage: 110,
    price: 20,
    dryTime: 24,
    description: 'Easy to sand, lightweight formula',
  },
  setting: {
    coverage: 90,
    price: 25,
    dryTime: 2,
    description: 'Fast-setting compound, chemically hardens',
  },
};

const JointCompoundCalculator = () => {
  const [useRoomCalc, setUseRoomCalc] = useState(false);
  const [inputs, setInputs] = useState({
    drywallArea: '',
    roomLength: '',
    roomWidth: '',
    ceilingHeight: 8,
    includeCeiling: 'yes',
    finishLevel: '4',
    jointType: 'standard',
    sheetSize: '4x8',
    installationPattern: 'horizontal',
    insideCorners: 4,
    outsideCorners: 0,
    compoundType: 'all_purpose',
    wasteFactor: 15,
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('No results available.');



  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
/// useEffect(() => {
   /// if (
     /// (useRoomCalc && inputs.roomLength && inputs.roomWidth && inputs.ceilingHeight) ||
     /// (!useRoomCalc && inputs.drywallArea)
   /// ) {
    ///  calculate();
   /// }
 /// }, [inputs, useRoomCalc]);

useEffect(() => {
  if (results) {
    setSummary(getResultSummary());
  } else {
    setSummary('No results available.');
  }
}, [results]);
const handleSubmit = () => {
  // Show loading animation (e.g., set a loading state to true)
  setLoading(true);

  // Wait 1 second (1000ms)
  setTimeout(() => {
    // Hide loading animation
    setLoading(false);

    // Perform calculation
    calculate();

    // Scroll smoothly to #result element
    const resultElement = document.getElementById('result');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 1000);
};

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const toggleRoomCalc = () => {
    setUseRoomCalc((prev) => !prev);
    setResults(null); // Reset results when toggling mode
    setError('');
  };

  const calculate = () => {
    let totalArea;
    const height = parseFloat(inputs.ceilingHeight);

    if (useRoomCalc) {
      const l = parseFloat(inputs.roomLength);
      const w = parseFloat(inputs.roomWidth);

      if (!l || !w || !height || l <= 0 || w <= 0 || height <= 0) {
        setResults(null);
        return setError('Please enter valid room dimensions');
      }
      const wallArea = 2 * (l + w) * height;
      const ceilingArea = inputs.includeCeiling === 'yes' ? l * w : 0;
      totalArea = wallArea + ceilingArea;
    } else {
      totalArea = parseFloat(inputs.drywallArea);
      if (!totalArea || totalArea <= 0) {
        setResults(null);
        return setError('Please enter a valid drywall area');
      }
    }

    const levelData = finishLevels[inputs.finishLevel];
    const compoundData = compoundTypes[inputs.compoundType];
    const sheetAreas = { '4x8': 32, '4x10': 40, '4x12': 48 };
    const sheetArea = sheetAreas[inputs.sheetSize];
    const numSheets = Math.ceil(totalArea / sheetArea);

    let linearFeetJoints = 0;
    if (useRoomCalc) {
      const l = parseFloat(inputs.roomLength);
      const w = parseFloat(inputs.roomWidth);
      const sheetHeight = inputs.sheetSize === '4x8' ? 8 : inputs.sheetSize === '4x10' ? 10 : 12;
      const horizontal = height > sheetHeight ? 2 * (l + w) : 0;
      const vertical = Math.ceil((2 * (l + w)) / 4) * height;
      const ceiling =
        inputs.includeCeiling === 'yes' ? Math.ceil(l / 4) * w + Math.ceil(w / 4) * l : 0;
      linearFeetJoints = horizontal + vertical + ceiling;
    } else {
      linearFeetJoints = totalArea * 1.2;
    }

    const cornerHeight = useRoomCalc ? height : 8;
    linearFeetJoints += (parseInt(inputs.insideCorners) + parseInt(inputs.outsideCorners)) * cornerHeight;

    const screwHoles = Math.ceil(totalArea);
    const baseCompound = (linearFeetJoints * levelData.compoundFactor * levelData.coats) / compoundData.coverage;
    const screwCompound = screwHoles * 0.001;
    const totalGallons = (baseCompound + screwCompound) * (1 + parseFloat(inputs.wasteFactor) / 100);
    const buckets = Math.ceil(totalGallons / 5);

    const paperTape = Math.ceil(linearFeetJoints * 1.1);
    const meshTape = inputs.jointType === 'butt' ? Math.ceil(linearFeetJoints * 0.3) : 0;
    const cornerBead = parseInt(inputs.outsideCorners) * cornerHeight;

    const cost = buckets * compoundData.price + paperTape * 0.05 + meshTape * 0.08 + cornerBead * 1.5;
    const laborHours = Math.ceil((totalArea / 100) * levelData.laborFactor * levelData.coats);
    const dryingTime = levelData.coats * compoundData.dryTime;

    setResults({
      totalArea,
      linearFeetJoints,
      totalGallons,
      buckets,
      paperTape,
      meshTape,
      cornerBead,
      screwHoles,
      cost,
      laborHours,
      coats: levelData.coats,
      dryingTime,
      guidelines: `${levelData.description} ${compoundData.description} Apply ${levelData.coats} coats with ${compoundData.dryTime} hour drying time between coats. Sand lightly between coats for best results.`,
    });
    setError('');
  };

  // Prepare summary string for chatbot
 const getResultSummary = () => {
  if (!results) return 'No results available.';

 return `Inputs:
Drywall Area: ${inputs.drywallArea || 'N/A'} sq ft
Room Dimensions: ${inputs.roomLength || 'N/A'} x ${inputs.roomWidth || 'N/A'} ft
Ceiling Height: ${inputs.ceilingHeight} ft
Include Ceiling: ${inputs.includeCeiling}
Finish Level: ${inputs.finishLevel}
Joint Type: ${inputs.jointType}
Sheet Size: ${inputs.sheetSize}
Installation Pattern: ${inputs.installationPattern}
Inside Corners: ${inputs.insideCorners}
Outside Corners: ${inputs.outsideCorners}
Compound Type: ${inputs.compoundType.replace('_', ' ')}
Waste Factor: ${inputs.wasteFactor}%

Results:
Drywall Area: ${results.totalArea?.toFixed(1) || 0} sq ft
Linear Feet of Joints: ${Math.ceil(results.linearFeetJoints || 0)}
Compound: ${results.totalGallons?.toFixed(1) || 0} gallons (${results.buckets || 0} buckets)
Tape Needed: ${results.paperTape || 0} ft paper, ${results.meshTape || 0} ft mesh
Corner Bead: ${results.cornerBead || 0} ft
Screw Holes: ${results.screwHoles || 0}
Total Cost: $${results.cost?.toFixed(2) || '0.00'}
Estimated Labor Hours: ${results.laborHours || 0}
Coats Needed: ${results.coats || 0}
Drying Time: ${results.dryingTime || 0} hours
Guidelines: ${results.guidelines || 'None'}`;
};

  return (
    <div className="container">
    

      <div className="glass-card">
        <form onSubmit={(e) => e.preventDefault()}>
          <button onClick={toggleRoomCalc} type="button" style={{ marginBottom: '15px' }}>
            {useRoomCalc ? 'Use Total Area' : 'Use Room Dimensions'}
          </button>

          {/* Example input fields; add more as needed */}
          {useRoomCalc ? (
            <>
              <label>
                Room Length (ft):
                <input
                  type="number"
                  id="roomLength"
                  value={inputs.roomLength}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  required
                />
              </label>
              <label>
                Room Width (ft):
                <input
                  type="number"
                  id="roomWidth"
                  value={inputs.roomWidth}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  required
                />
              </label>
              <label>
                Ceiling Height (ft):
                <input
                  type="number"
                  id="ceilingHeight"
                  value={inputs.ceilingHeight}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  required
                />
              </label>
              <label>
                Include Ceiling:
                <select id="includeCeiling" value={inputs.includeCeiling} onChange={handleChange}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
            </>
          ) : (
            <label>
              Drywall Area (sq ft):
              <input
                type="number"
                id="drywallArea"
                value={inputs.drywallArea}
                onChange={handleChange}
                min="0"
                step="any"
                required
              />
            </label>
          )}

          <label>
            Finish Level:
            <select id="finishLevel" value={inputs.finishLevel} onChange={handleChange}>
              {Object.entries(finishLevels).map(([key, val]) => (
                <option key={key} value={key}>
                  {key} - {val.description}
                </option>
              ))}
            </select>
          </label>

          <label>
            Joint Type:
            <select id="jointType" value={inputs.jointType} onChange={handleChange}>
              <option value="standard">Standard</option>
              <option value="butt">Butt</option>
            </select>
          </label>

          <label>
            Sheet Size:
            <select id="sheetSize" value={inputs.sheetSize} onChange={handleChange}>
              <option value="4x8">4x8</option>
              <option value="4x10">4x10</option>
              <option value="4x12">4x12</option>
            </select>
          </label>

          <label>
            Installation Pattern:
            <select
              id="installationPattern"
              value={inputs.installationPattern}
              onChange={handleChange}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </label>

          <label>
            Inside Corners:
            <input
              type="number"
              id="insideCorners"
              value={inputs.insideCorners}
              onChange={handleChange}
              min="0"
              step="1"
            />
          </label>

          <label>
            Outside Corners:
            <input
              type="number"
              id="outsideCorners"
              value={inputs.outsideCorners}
              onChange={handleChange}
              min="0"
              step="1"
            />
          </label>

          <label>
            Compound Type:
            <select id="compoundType" value={inputs.compoundType} onChange={handleChange}>
              {Object.entries(compoundTypes).map(([key, val]) => (
                <option key={key} value={key}>
                  {key.replace('_', ' ')} - {val.description}
                </option>
              ))}
            </select>
          </label>

          <label>
            Waste Factor (%):
            <input
              type="number"
              id="wasteFactor"
              value={inputs.wasteFactor}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
            />
          </label>
          <button onClick={handleSubmit}> Calculate</button>
        </form>

        {error && <div className="error show" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                {loading && <Loader />}

            
        {results && (
          <div id='result' className="result-section show" style={{ marginTop: '20px' }}>
            <h3 className="result-title">Joint Compound Calculation Results</h3>
            <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div className="result-item">
                <div className="result-value">{results.totalArea.toFixed(1)} sq ft</div>
                <div className="result-label">Total Drywall Area</div>
              </div>
              <div className="result-item">
                <div className="result-value">{Math.ceil(results.linearFeetJoints)}</div>
                <div className="result-label">Linear Feet of Joints</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.totalGallons.toFixed(1)}</div>
                <div className="result-label">Compound (gallons)</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.buckets}</div>
                <div className="result-label">Compound Buckets</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.paperTape}</div>
                <div className="result-label">Paper Tape (feet)</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.meshTape}</div>
                <div className="result-label">Mesh Tape (feet)</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.cornerBead}</div>
                <div className="result-label">Corner Bead (feet)</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.screwHoles}</div>
                <div className="result-label">Screw Holes</div>
              </div>
              <div className="result-item">
                <div className="result-value">${results.cost.toFixed(2)}</div>
                <div className="result-label">Total Material Cost</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.laborHours}</div>
                <div className="result-label">Est. Labor Hours</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.coats}</div>
                <div className="result-label">Coats Needed</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.dryingTime} hours</div>
                <div className="result-label">Total Drying Time</div>
              </div>
            </div>

            <div className="note" style={{ marginTop: '15px' }}>
              <div className="note-title" style={{ fontWeight: 'bold' }}>
                Application Guidelines:
              </div>
              <div className="note-text">{results.guidelines}</div>
            </div>
          </div>
        )}

        {/* ChatBot integration */}
       
       
            <ChatBot
                resultSummary={summary}
              serviceName="Drywall Mud and Tape Calculator"
            />
         
    
      </div>
    </div>
  );
};

export default JointCompoundCalculator;
