/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import GetStarted from './pages/GetStarted';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import CustomerQueue from './pages/CustomerQueue';
import DisplayScreen from './pages/DisplayScreen';
import { QueueProvider } from './context/QueueContext';

export default function App() {
  return (
    <QueueProvider>
      <Router>
        <div className="min-h-screen selection:bg-brand-blue selection:text-white">
          <Navbar />
          <main>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/about" element={<About />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/queue" element={<CustomerQueue />} />
                <Route path="/display" element={<DisplayScreen />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </QueueProvider>
  );
}
