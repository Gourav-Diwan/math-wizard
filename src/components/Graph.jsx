import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, ResponsiveContainer } from 'recharts';

const Graph = ({ 
  graphData, 
  colors, 
  levelData, 
  xGuess, 
  yGuess, 
  solved, 
  showSolution 
}) => {
  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500 shadow-2xl">
      <h2 className="text-3xl font-bold text-green-300 mb-4">📊 Visual Graph</h2>
      <p className="text-green-200 mb-4">
        The solution is where the lines intersect! 
        <span className="block mt-2 text-sm">
          <span style={{color: colors.line1}}>■</span> {levelData.eq1Text}: {levelData.eq1}
          <br />
          <span style={{color: colors.line2}}>■</span> {levelData.eq2Text}: {levelData.eq2}
        </span>
      </p>
      
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={graphData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="x" 
            stroke="#fff"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => value.toFixed(0)}
            label={{ value: `${levelData.xLabel} (x)`, position: 'insideBottom', offset: -5, fill: '#fff' }}
          />
          <YAxis 
            stroke="#fff"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => value.toFixed(0)} 
            label={{ value: `${levelData.yLabel} (y)`, angle: -90, position: 'insideLeft', fill: '#fff' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const xValue = payload[0].payload.x;
                const y1Value = payload[0].payload.y1;
                
                return (
                  <div style={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #555', 
                    padding: '10px',
                    borderRadius: '4px'
                  }}>
                    <p style={{ color: '#fff', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                      {levelData.xLabel}: {xValue.toFixed(1)}
                    </p>
                    {y1Value !== null && (
                      <p style={{ color: '#a855f7', margin: '0' }}>
                        {levelData.yLabel}: {y1Value.toFixed(1)}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="y1" 
            stroke={colors.line1}
            strokeWidth={4}
            dot={false}
            name={levelData.eq1Text}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="y2" 
            stroke={colors.line2}
            strokeWidth={4}
            dot={false}
            name={levelData.eq2Text}
            connectNulls={false}
          />
          {(solved || showSolution) && (
            <ReferenceDot 
              x={levelData.solution.x} 
              y={levelData.solution.y} 
              r={12} 
              fill={solved ? "#fbbf24" : "#fb923c"}
              stroke="#fff"
              strokeWidth={4}
              label={{
                value: `(${levelData.solution.x.toFixed(1)}, ${levelData.solution.y.toFixed(1)})`,
                position: 'top',
                fill: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                offset: 15
              }}
              isFront={true}
            />
          )}
          {!solved && !showSolution && xGuess && yGuess && !isNaN(parseFloat(xGuess)) && !isNaN(parseFloat(yGuess)) && (
            <ReferenceDot 
              x={parseFloat(xGuess)} 
              y={parseFloat(yGuess)} 
              r={10} 
              fill="#3b82f6" 
              stroke="#fff"
              strokeWidth={3}
              label={{
                value: `(${parseFloat(xGuess).toFixed(1)}, ${parseFloat(yGuess).toFixed(1)})`,
                position: 'top',
                fill: '#60a5fa',
                fontSize: 14,
                fontWeight: 'bold',
                offset: 12
              }}
              isFront={true}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {solved && (
        <div className="mt-4 bg-green-900 bg-opacity-50 p-5 rounded-xl border-2 border-green-400">
          <p className="text-green-100 text-lg">
            <strong>🎯 Perfect!</strong> The golden dot at ({levelData.solution.x.toFixed(1)}, {levelData.solution.y.toFixed(1)}) is where both equations are satisfied!
          </p>
        </div>
      )}

      {showSolution && !solved && (
        <div className="mt-4 bg-orange-900 bg-opacity-50 p-5 rounded-xl border-2 border-orange-400">
          <p className="text-orange-100 text-lg">
            <strong>📍 Solution:</strong> The orange dot shows ({levelData.solution.x.toFixed(1)}, {levelData.solution.y.toFixed(1)}) - where the lines intersect!
          </p>
        </div>
      )}
      
      {!solved && !showSolution && xGuess && yGuess && (
        <div className="mt-4 bg-blue-900 bg-opacity-50 p-5 rounded-xl border-2 border-blue-400">
          <p className="text-blue-100 text-lg">
            <strong>Your guess:</strong> Blue dot at ({parseFloat(xGuess).toFixed(1)}, {parseFloat(yGuess).toFixed(1)}). Get it to the intersection!
          </p>
        </div>
      )}
    </div>
  );
};

export default Graph;
