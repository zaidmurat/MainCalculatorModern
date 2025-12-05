// src/components/HeroSection.tsx

// Tentukan type untuk data (props) yang akan diterima oleh komponen ini
interface HeroSectionProps {
    title: string;
    subtitle: string;
}

// Gunakan React.FC dan HeroSectionProps untuk type safety
const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => {
    return (
        <section className="hero">
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <button className="cta-button">Daftar Sekarang</button>
        </section>
    );
};

export default HeroSection;