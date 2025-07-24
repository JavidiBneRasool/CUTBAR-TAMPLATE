export function SheepIcon({ size = 40, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Sheep Body */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-gray-100 via-white to-gray-200"
        style={{
          width: size * 0.7,
          height: size * 0.6,
          left: size * 0.15,
          top: size * 0.25,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.15)'
        }}
      />
      
      {/* Sheep Head */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-gray-50 via-white to-gray-100"
        style={{
          width: size * 0.5,
          height: size * 0.45,
          left: size * 0.25,
          top: size * 0.05,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.15)'
        }}
      />
      
      {/* Left Horn */}
      <div 
        className="absolute bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 rounded-sm"
        style={{
          width: size * 0.08,
          height: size * 0.3,
          left: size * 0.35,
          top: size * 0.02,
          transform: 'rotate(-15deg)',
          borderRadius: '50% 50% 20% 20%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}
      />
      
      {/* Right Horn */}
      <div 
        className="absolute bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 rounded-sm"
        style={{
          width: size * 0.08,
          height: size * 0.3,
          left: size * 0.57,
          top: size * 0.02,
          transform: 'rotate(15deg)',
          borderRadius: '50% 50% 20% 20%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}
      />
      
      {/* Left Eye */}
      <div 
        className="absolute rounded-full bg-black"
        style={{
          width: size * 0.06,
          height: size * 0.06,
          left: size * 0.35,
          top: size * 0.2
        }}
      />
      
      {/* Right Eye */}
      <div 
        className="absolute rounded-full bg-black"
        style={{
          width: size * 0.06,
          height: size * 0.06,
          left: size * 0.59,
          top: size * 0.2
        }}
      />
      
      {/* Nose */}
      <div 
        className="absolute rounded-full bg-pink-300"
        style={{
          width: size * 0.08,
          height: size * 0.05,
          left: size * 0.46,
          top: size * 0.3
        }}
      />
      
      {/* Wool Texture */}
      <div 
        className="absolute rounded-full bg-white opacity-60"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          left: size * 0.2,
          top: size * 0.35
        }}
      />
      <div 
        className="absolute rounded-full bg-white opacity-40"
        style={{
          width: size * 0.12,
          height: size * 0.12,
          left: size * 0.65,
          top: size * 0.4
        }}
      />
      <div 
        className="absolute rounded-full bg-white opacity-50"
        style={{
          width: size * 0.1,
          height: size * 0.1,
          left: size * 0.45,
          top: size * 0.5
        }}
      />
    </div>
  );
}