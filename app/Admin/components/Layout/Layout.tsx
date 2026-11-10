import "./Layout.css";


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {
  return (
    <main className="layout-container">

      {/* Topo, menu e rodapé vêm do layout do Admin (iguais aos da home) */}

      <section className="page-content">
        {children}
      </section>

    </main>
  );
}