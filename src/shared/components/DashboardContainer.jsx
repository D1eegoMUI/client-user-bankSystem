
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const DashboardContainer = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar onMenuClick={toggleSidebar} />

            <div className="flex flex-1 relative">
                {/* 
                  Agregamos flex-shrink-0 para que el Sidebar mantenga su ancho fijo 
                  y no se deje "aplastar" por el contenido del main.
                */}
                <div className="flex-shrink-0">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                </div>

                {/* 
                  Cambiamos w-full por min-w-0. 
                  min-w-0 permite que el contenedor flexible se reduzca correctamente 
                  en lugar de forzar el ancho basado en su contenido interno.
                */}
                <main className="flex-1 min-w-0 p-4 md:p-8 bg-gradient-to-br from-gray-50 to-emerald-50/30">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </div>
        </div>
    );
}