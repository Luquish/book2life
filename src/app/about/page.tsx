import Image from 'next/image'

export default function About() {
  return (
    <main className="flex min-h-screen flex-col bg-[#2D1B69] text-white relative overflow-hidden">
      {/* Estrellas decorativas */}
      <div className="absolute inset-0">
        <div className="absolute h-2 w-2 bg-yellow-200 rounded-full top-20 left-1/4 animate-[twinkle_3s_ease-in-out_infinite]" />
        <div className="absolute h-2 w-2 bg-yellow-200 rounded-full top-40 right-1/3 animate-[twinkle_4s_ease-in-out_infinite]" />
        <div className="absolute h-2 w-2 bg-yellow-200 rounded-full bottom-32 left-1/3 animate-[twinkle_5s_ease-in-out_infinite]" />
        <div className="absolute h-2 w-2 bg-yellow-200 rounded-full top-60 right-1/4 animate-[twinkle_3.5s_ease-in-out_infinite]" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-400">
              ¡Hola! Somos Book2Life 👋
            </h1>
            <p className="text-xl text-gray-200">
              Donde tus palabras cobran vida
            </p>
          </div>

          <div className="space-y-12">
            {/* Historia */}
            <section className="bg-[#1a103f]/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                Nuestra Historia <span className="text-yellow-300">✨</span>
              </h2>
              <p className="text-gray-200">
                Todo comenzó en una cena entre dos amigos curiosos. Entre risas y lluvia de ideas, 
                surgió algo mágico: ¿Y si pudiéramos darle vida a las historias con solo un par de clicks? 
                Así nació Book2Life, un proyecto que combina nuestra pasión por la tecnología con el 
                deseo de hacer algo diferente y divertido.
              </p>
            </section>

            {/* Misión */}
            <section className="bg-[#1a103f]/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                Nuestra Misión <span className="text-pink-400">🎯</span>
              </h2>
              <p className="text-gray-200">
                Queremos darle vida a la imaginación. ¿Sabes esa sensación cuando escribes algo y 
                lo ves claramente en tu mente? Nuestro objetivo es hacer que esa imagen mental 
                se convierta en algo que puedas ver y compartir. Es como magia, ¡pero con tecnología!
              </p>
            </section>

            {/* Para Quién */}
            <section className="bg-[#1a103f]/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                ¿Para Quién Es? <span className="text-yellow-300">🌟</span>
              </h2>
              <p className="text-gray-200">
                Book2Life está especialmente pensado para los más pequeños. Queremos que cada niño y niña 
                pueda experimentar la magia de ver sus historias cobrar vida. No se trata solo de crear 
                ilustraciones, sino de vivir ese momento especial cuando ves tu creación transformarse 
                en algo visual y único.
              </p>
            </section>

            {/* Equipo */}
            <section className="bg-[#1a103f]/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                El Equipo <span className="text-blue-400">👥</span>
              </h2>
              <p className="text-gray-200">
                Somos simplemente dos amigos curiosos que decidieron crear algo especial. 
                Unidos por nuestra pasión por la tecnología y las ganas de experimentar con 
                ideas nuevas, le dimos vida a Book2Life en tiempo récord.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
} 