import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, QrCode, MapPin, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="text-center">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full shadow-2xl">
                <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              EventInvite
              <Sparkles className="inline-block ml-2 h-8 w-8 sm:h-10 sm:w-10 text-yellow-300 animate-pulse" />
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Crea invitaciones digitales elegantes para tus eventos especiales.
              Gestiona confirmaciones, controla asistencias y personaliza cada detalle.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/admin"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-medium rounded-lg text-purple-600 bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <Settings className="mr-2 h-5 w-5" />
                Panel Administrativo
              </Link>
              <Link
                to="/invitation/event-1/guest-1"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-base sm:text-lg font-medium rounded-lg text-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                Ver Demo Invitación
              </Link>
            </motion.div>
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
    <motion.div
      className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 rounded-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, translateY: -10 }}
    >
      <motion.div
        className="flex justify-center mb-4"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default HomePage;