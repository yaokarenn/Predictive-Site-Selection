export interface LSTMMetrics {
  year: number;
  propertyValueIndex: number; // 0.0 to 10.0 (recent home values index)
  footTrafficIndex: number;    // 0.0 to 10.0 (retail/transit pedestrian logs)
  permitsRate: number;         // 0.0 to 10.0 (redevelopment & construction permits)
  industrialConversion: number;// 0.0 to 10.0 (industrial sites transitioned to creative/commercial hubs)
  medianIncomeRatio: number;   // 0.0 to 10.0 (income ratio compared to city median)
}

export interface NeighborhoodHistory {
  id: string;
  name: string;
  borough: string;
  history: LSTMMetrics[];
}

// Complete single-cell LSTM Recurrent Neural network implementer in TypeScript
export class LSTMCell {
  // Forget Gate Parameters
  public Wf = 0.5; public Uf = 0.2; public bf = -0.1;
  // Input Gate Parameters
  public Wi = 0.4; public Ui = 0.3; public bi = -0.2;
  // Cell Candidate Parameters
  public Wc = 0.6; public Uc = 0.3; public bc = 0.0;
  // Output Gate Parameters
  public Wo = 0.5; public Uo = 0.2; public bo = -0.1;

  // Output Projection Parameter
  public Wy = 1.0; public by = 0.0;

  constructor(seed?: string) {
    this.randomizeWeights(seed);
  }

  private randomizeWeights(seed?: string) {
    let seedVal = 0;
    if (seed) {
      for (let i = 0; i < seed.length; i++) {
        seedVal += seed.charCodeAt(i);
      }
    }
    const rand = () => {
      if (seed) {
        // Simple deterministic sinusoidal generator
        const x = Math.sin(seedVal++) * 10000;
        return (x - Math.floor(x) - 0.5) * 0.4;
      }
      return (Math.random() - 0.5) * 0.4;
    };
    this.Wf += rand(); this.Uf += rand(); this.bf += rand();
    this.Wi += rand(); this.Ui += rand(); this.bi += rand();
    this.Wc += rand(); this.Uc += rand(); this.bc += rand();
    this.Wo += rand(); this.Uo += rand(); this.bo += rand();
    this.Wy += rand(); this.by += rand();
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private tanh(x: number): number {
    return Math.tanh(x);
  }

  // Forward pass for a single timestep
  // x: aggregate feature input for current year
  // h_prev: previous hidden state
  // c_prev: previous cell state
  public forward(x: number, h_prev: number, c_prev: number) {
    // Forget Gate
    const f_g = this.sigmoid(this.Wf * x + this.Uf * h_prev + this.bf);
    
    // Input Gate
    const i_g = this.sigmoid(this.Wi * x + this.Ui * h_prev + this.bi);
    
    // Candidate Cell State
    const c_tilde = this.tanh(this.Wc * x + this.Uc * h_prev + this.bc);
    
    // Updated Cell State
    const c = f_g * c_prev + i_g * c_tilde;
    
    // Output Gate
    const o_g = this.sigmoid(this.Wo * x + this.Uo * h_prev + this.bo);
    
    // Hidden State
    const h = o_g * this.tanh(c);

    // Dynamic output prediction (for urban renewal probability index between 0.0 and 1.0)
    const y = this.sigmoid(this.Wy * h + this.by);

    return { h, c, y, gates: { forget: f_g, input: i_g, candidate: c_tilde, output: o_g } };
  }

  // Simple Gradient Descent descent trainer for sequence matching
  // Fits weights to match historical vectors towards known 2026 targets
  public train(sequences: number[][], targets: number[], epochs = 80, lr = 0.05) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      for (let s = 0; s < sequences.length; s++) {
        const seq = sequences[s];
        const target = targets[s];

        // Process sequence
        let h = 0.0;
        let c = 0.0;
        let y = 0.0;
        
        const history: any[] = [];
        for (const input of seq) {
          const step = this.forward(input, h, c);
          h = step.h;
          c = step.c;
          y = step.y;
          history.push({ input, h_prev: h, c_prev: c, ...step });
        }

        // Output error
        const error = y - target;
        totalLoss += 0.5 * error * error;

        // Simplified BPTT / Weight update updates directly proportional to active gradients
        const dy = error * y * (1 - y); // output sigmoid derivative
        this.Wy -= lr * dy * h;
        this.by -= lr * dy;

        // Backward update adjustments for internal gates based on final hidden state magnitude
        const dh = dy * this.Wy;
        const dc = dh * 0.1; // simple decay factor

        // Average step gradient inputs
        for (let i = history.length - 1; i >= 0; i--) {
          const step = history[i];
          const x = step.input;
          
          // Forget parameters
          const df = dc * c * step.gates.forget * (1 - step.gates.forget);
          this.Wf -= lr * df * x;
          this.bf -= lr * df;

          // Input parameters
          const di = dc * step.gates.candidate * step.gates.input * (1 - step.gates.input);
          this.Wi -= lr * di * x;
          this.bi -= lr * di;

          // Candidate parameters
          const dc_tilde = dc * step.gates.input * (1 - step.gates.candidate * step.gates.candidate);
          this.Wc -= lr * dc_tilde * x;
          this.bc -= lr * dc_tilde;

          // Output parameters
          const do_g = dh * this.tanh(step.c) * step.gates.output * (1 - step.gates.output);
          this.Wo -= lr * do_g * x;
          this.bo -= lr * do_g;
        }
      }
    }
  }
}

// Generate realistic 2022-2026 temporal historical trends for major NYC neighborhoods
export function generateNeighborhoodHistoricalTrends(id: string, boroName: string, name: string): LSTMMetrics[] {
  // Seed random factors based on string hash for consistent results
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed += id.charCodeAt(i);
  const pseudoRand = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Base profile presets depending on known NYC gentrification pressure points vs established vs industrial
  let pBase = 4.0; // Property Base
  let fBase = 4.0; // Foot Traffic Base
  let cBase = 2.0; // Permit Rate
  let iBase = 1.0; // Industrial Conversion Rate
  let mBase = 3.5; // Income Ratio

  const nameLower = name.toLowerCase();
  const boroLower = boroName.toLowerCase();

  if (nameLower.includes("williamsburg") || nameLower.includes("dumbo") || nameLower.includes("lic") || nameLower.includes("astoria")) {
    pBase = 7.5; fBase = 8.5; cBase = 8.0; iBase = 8.5; mBase = 7.0; // High Gentrification / Adaptive industrial convert
  } else if (nameLower.includes("bushwick") || nameLower.includes("greenpoint") || nameLower.includes("crown heights") || nameLower.includes("mott haven") || boroLower.includes("bronx") && nameLower.includes("south")) {
    pBase = 6.0; fBase = 6.5; cBase = 7.5; iBase = 7.0; mBase = 4.8; // Active/Emergent redevelopment
  } else if (boroLower.includes("manhattan") && (nameLower.includes("chelsea") || nameLower.includes("village") || nameLower.includes("midtown") || nameLower.includes("fidi"))) {
    pBase = 9.0; fBase = 9.2; cBase = 5.0; iBase = 4.0; mBase = 9.0; // Highly established / core
  } else if (nameLower.includes("coney") || nameLower.includes("st-george") || nameLower.includes("stapleton") || nameLower.includes("flushing") || nameLower.includes("corona")) {
    pBase = 5.0; fBase = 6.0; cBase = 5.5; iBase = 3.0; mBase = 4.5; // Moderate industrialization / transit-oriented hub
  } else {
    // Standard random distribution
    pBase = 3.5 + pseudoRand() * 2.5;
    fBase = 4.0 + pseudoRand() * 2.5;
    cBase = 1.5 + pseudoRand() * 3.5;
    iBase = 1.0 + pseudoRand() * 2.0;
    mBase = 3.0 + pseudoRand() * 2.5;
  }

  // Generate Year-by-Year sequences from 2022 to 2026 showing compounding trends
  const trends: LSTMMetrics[] = [];
  for (let year = 2022; year <= 2026; year++) {
    const elapsed = year - 2022;
    // Compounding growth multipliers
    const pGrowth = 1 + (0.04 + pseudoRand() * 0.08) * elapsed; // Property rises 4% to 12% annually
    const fGrowth = 1 + (0.03 + pseudoRand() * 0.06) * elapsed; // Foot traffic post-pandemic recovery
    const cGrowth = 1 + (pseudoRand() * 0.12 - 0.04) * elapsed; // Construction fluctuations
    const iGrowth = 1 + (0.06 + pseudoRand() * 0.12) * elapsed; // Industrial conversions accelerate
    const mGrowth = 1 + (0.02 + pseudoRand() * 0.05) * elapsed; // Median income ratio increases

    trends.push({
      year,
      propertyValueIndex: Math.min(10.0, Math.max(1.0, pBase * pGrowth)),
      footTrafficIndex: Math.min(10.0, Math.max(1.0, fBase * fGrowth)),
      permitsRate: Math.min(10.0, Math.max(1.0, cBase * cGrowth)),
      industrialConversion: Math.min(10.0, Math.max(0.5, iBase * iGrowth)),
      medianIncomeRatio: Math.min(10.0, Math.max(1.0, mBase * mGrowth))
    });
  }

  return trends;
}

// Predictor running full sequence training and generating predictions for 2031
export function runRenewalLSTMForecast(id: string, boroName: string, name: string) {
  const history = generateNeighborhoodHistoricalTrends(id, boroName, name);
  
  // Aggregate multi-feature sequence into single numeric input value between 0.0 and 1.0 for LSTM computation
  // x_t = (w1 * property + w2 * foot_traffic + w3 * permits + w4 * industrial_convert + w5 * income_ratio)
  const sequences = history.map(h => {
    return (
      h.propertyValueIndex * 0.35 +
      h.footTrafficIndex * 0.15 +
      h.permitsRate * 0.20 +
      h.industrialConversion * 0.15 +
      h.medianIncomeRatio * 0.15
    ) / 10.0; // Scaled to [0, 1]
  });

  // Simple classification representing whether a community is actively undergoing renewal by 2026
  // Seed the classification ground truth target based on historic levels
  const lastState = sequences[sequences.length - 1];
  const target = lastState > 0.65 ? 0.9 : lastState > 0.45 ? 0.6 : 0.25;

  const cell = new LSTMCell(id);

  // Run LSTM weight optimization/training over the historical sequences
  // Feed various window subsequences to reinforce sequential learning
  const trainingSequences = [
    sequences.slice(0, 3), // 2022 - 2024
    sequences.slice(0, 4), // 2022 - 2025
    sequences
  ];
  const trainingTargets = [
    target * 0.75,
    target * 0.88,
    target
  ];

  cell.train(trainingSequences, trainingTargets, 60, 0.08);

  // Roll model forward into future steps: 2027, 2028, 2029, 2030, 2031 (5 years in future)
  let h = 0.0;
  let c = 0.0;
  let currentPrediction = 0.0;
  let lastOutputGates = { forget: 0.5, input: 0.5, candidate: 0.0, output: 0.5 };

  // Step 1: Run through 2022-2026 history to prime internal cell hidden/cell states (h, c)
  for (const x of sequences) {
    const step = cell.forward(x, h, c);
    h = step.h;
    c = step.c;
    currentPrediction = step.y;
    lastOutputGates = step.gates;
  }

  // Step 2: Extrapolate forward for 5 years (2027 to 2031) by fed routing feedback outputs back into the inputs
  // Compound predicted growth factors dynamically
  const projections: { year: number; predictedIndex: number }[] = [];
  let currentInput = sequences[sequences.length - 1]; // Start with 2026 state

  for (let stepYear = 2027; stepYear <= 2031; stepYear++) {
    // Project small growth on input sequence based on trained prediction trajectory
    const growthHeuristic = 0.015 + (currentPrediction * 0.025);
    currentInput = Math.min(1.0, currentInput + growthHeuristic);
    
    const step = cell.forward(currentInput, h, c);
    h = step.h;
    c = step.c;
    currentPrediction = step.y;
    projections.push({
      year: stepYear,
      predictedIndex: currentPrediction
    });
  }

  // 2031 Urban Renewal Score (Updated based on data model variables)
  const score2031 = currentPrediction;

  return {
    id,
    name,
    borough: boroName,
    historicalInputSequence: sequences,
    history,
    score2031, // Predicted index for 2031 (0.0 to 1.0)
    projections,
    lstmModelDetails: {
      trainedWeights: {
        forget: { Wf: cell.Wf, Uf: cell.Uf, bf: cell.bf },
        input: { Wi: cell.Wi, Ui: cell.Ui, bi: cell.bi },
        candidate: { Wc: cell.Wc, Uc: cell.Uc, bc: cell.bc },
        output: { Wo: cell.Wo, Uo: cell.Uo, bo: cell.bo }
      },
      lastCellState: c,
      lastHiddenState: h,
      activeGates: lastOutputGates
    }
  };
}
