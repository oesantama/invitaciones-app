import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, QrCode, MapPin, Settings } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-500">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
                <Calendar className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              EventInvite
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
              Crea invitaciones digitales elegantes para tus eventos especiales. 
              Gestiona confirmaciones, controla asistencias y personaliza cada detalle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-purple-600 bg-white hover:bg-gray-50 transition duration-300 shadow-lg"
              >
                <Settings className="mr-2 h-5 w-5" />
                Panel Administrativo
              </Link>
              <Link
                to="/invitation/event-1/guest-1"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-purple-600 transition duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                Ver Demo Invitación
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para crear y gestionar eventos inolvidables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-purple-600" />}
              title="Invitaciones Elegantes"
              description="Diseños personalizables con colores, tipografías y elementos visuales únicos para cada evento."
            />
            <FeatureCard
              icon={<QrCode className="h-8 w-8 text-pink-600" />}
              title="Códigos QR"
              description="Genera códigos QR únicos para cada invitación y controla el acceso al evento de forma digital."
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-red-600" />}
              title="Ubicación con GPS"
              description="Integración con Google Maps para mostrar la ubicación exacta del evento a tus invitados."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-600" />}
              title="Gestión de Invitados"
              description="Control completo de confirmaciones, acompañantes, preferencias de menú y asistencia."
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8 text-green-600" />}
              title="Panel de Control"
              description="Dashboard completo para monitorear confirmaciones, asistencias y estadísticas del evento."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-orange-600" />}
              title="Cronograma Detallado"
              description="Comparte el programa completo del evento con horarios y actividades específicas."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para crear tu próximo evento?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Únete a miles de organizadores que ya confían en EventInvite para sus eventos especiales.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-purple-600 bg-white hover:bg-gray-50 transition duration-300 shadow-lg"
          >
            Comenzar Ahora
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">EventInvite</h3>
            <p className="text-gray-400 mb-4">
              Haciendo que cada evento sea memorable
            </p>
            <p className="text-sm text-gray-500">
              © 2024 EventInvite. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-300">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  );
};

export default HomePage;