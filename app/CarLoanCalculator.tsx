"use client";

import React, { useState, useMemo } from 'react';

// 1. Tentukan TYPE dengan TypeScript
interface CalculationResult {
    monthlyPayment: number | null;
    dsrValue: number | null;
    statusText: string;
    statusClass: string;
}

// Gayaan untuk Footer
const footerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '550px',
    background: '#333',
    color: '#fff',
    textAlign: 'center' as const,
    padding: '15px',
    marginTop: '20px',
    borderRadius: '0 0 12px 12px', // Hanya bahagian bawah
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
};

// 2. Fungsi Komponen Utama (EXPORT DEFAULT DI SINI)
export default function CarLoanCalculator() { 
// **********************************************
// NOTE: Saya tukar ini daripada 'const CarLoanCalculator: React.FC = () =>' 
// kepada 'export default function CarLoanCalculator()'
// **********************************************

    // --- STATE MANAGEMENT ---
    // State diubah suai untuk menangani input
    const [loanAmount, setLoanAmount] = useState<number | ''>('');
    const [loanYears, setLoanYears] = useState<number | ''>('');
    const [interestRate, setInterestRate] = useState<number | ''>('');
    const [netIncome, setNetIncome] = useState<number | ''>('');
    const [existingDebt, setExistingDebt] = useState<number | ''>('');

    // Penentu sama ada semua input utama (selain existingDebt) adalah sah
    const isReadyToCalculate = typeof loanAmount === 'number' && loanAmount > 0 &&
        typeof loanYears === 'number' && loanYears > 0 &&
        typeof interestRate === 'number' && interestRate > 0 &&
        typeof netIncome === 'number' && netIncome > 0;

    // --- LOGIK KIRAAN (Diaktifkan secara live melalui useMemo) ---
    const calculation: CalculationResult = useMemo(() => {
        // Tetapkan 0 jika state adalah '' atau null
        const loan = typeof loanAmount === 'number' ? loanAmount : 0;
        const years = typeof loanYears === 'number' ? loanYears : 0;
        const interest = typeof interestRate === 'number' ? interestRate : 0;
        const income = typeof netIncome === 'number' ? netIncome : 0;

        // Gantikan '' dengan 0 untuk pengiraan hutang sedia ada
        const debt = typeof existingDebt === 'number' ? existingDebt : 0;

        // Jika tidak sedia, pulangkan null
        if (!isReadyToCalculate) {
            return { monthlyPayment: null, dsrValue: null, statusText: '', statusClass: '' };
        }

        // Kira Ansuran Bulanan (Simple Interest)
        const totalInterest = loan * (interest / 100) * years;
        const totalPayable = loan + totalInterest;
        const monthlyPayment = totalPayable / (years * 12);

        // Kira DSR
        const totalMonthlyDebt = debt + monthlyPayment;
        let dsr = (totalMonthlyDebt / income) * 100;
        const dsrFixed = parseFloat(dsr.toFixed(2));

        // Tentukan Status Kelulusan
        let statusText: string;
        let statusClass: string;

        if (dsrFixed <= 40) {
            statusText = 'TINGGI (Sangat Baik)';
            statusClass = 'high';
        } else if (dsrFixed > 40 && dsrFixed <= 60) {
            statusText = 'SEDERHANA (Bergantung pada Bank)';
            statusClass = 'medium';
        } else { // dsr > 60
            statusText = 'RENDAH (Berisiko Tinggi)';
            statusClass = 'low';
        }

        return { monthlyPayment, dsrValue: dsrFixed, statusText, statusClass };

    }, [loanAmount, loanYears, interestRate, netIncome, existingDebt, isReadyToCalculate]);

    // --- CSS IN JS (Gaya Disiplinkan) ---
    const styles = {
        wrapper: {
            fontFamily: 'Roboto, sans-serif',
            background: '#f4f7f6', // Latar Belakang Kelabu Lembut
            minHeight: '100vh',
            padding: '30px 15px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            color: '#333',
        },
        container: {
            maxWidth: '550px',
            width: '100%',
            background: '#ffffff', // Kad Putih
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        },
        title: {
            textAlign: 'center' as const,
            color: '#1a73e8', // Biru Profesional
            marginBottom: '20px',
            fontSize: '28px',
            fontWeight: 600,
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box' as const,
            marginBottom: '20px',
            transition: 'border-color 0.3s',
            color: '#000',
        },
        inputFocus: {
            borderColor: '#1a73e8',
            outline: 'none',
        },
        label: {
            display: 'block',
            fontWeight: 'bold' as const,
            marginBottom: '8px',
            color: '#333',
        },
        // Button style dikekalkan untuk rujukan tetapi diasingkan 
        // kerana elemen button telah dibuang dari JSX utama.
        resultSection: {
            marginTop: '30px',
            padding: '20px',
            background: '#e8f0fe', // Latar Belakang Hasil yang Ringan
            borderRadius: '10px',
            animation: 'fadeIn 0.5s ease-in-out',
            border: '1px solid #c8d9e6',
        },
        resultItem: {
            display: 'flex',
            justifyContent: 'space-between' as const,
            padding: '10px 0',
            borderBottom: '1px dashed #c0c0c0',
        },
        dsrValue: {
            fontSize: '20px',
            fontWeight: 700,
        },
    };

    const StatusColors: { [key: string]: string } = {
        'high': '#28a745', // Hijau gelap
        'medium': '#ffc107', // Kuning
        'low': '#dc3545', // Merah
    };

    // --- RENDER JSX ---
    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h2 style={styles.title}>💰 Kalkulator Pinjaman Kereta & DSR</h2>

                {/* Input Pinjaman */}
                <label htmlFor="loanAmount" style={styles.label}>Jumlah Pinjaman Kereta (RM)</label>
                <input
                    type="number"
                    id="loanAmount"
                    placeholder="Contoh: 50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value) || '')}
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = styles.inputFocus.borderColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = styles.input.border.split(' ')[2]}
                />

                <label htmlFor="loanYears" style={styles.label}>Tempoh Pinjaman (Tahun)</label>
                <input
                    type="number"
                    id="loanYears"
                    placeholder="Contoh: 9"
                    value={loanYears}
                    onChange={(e) => setLoanYears(parseFloat(e.target.value) || '')}
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = styles.inputFocus.borderColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = styles.input.border.split(' ')[2]}
                />

                <label htmlFor="interestRate" style={styles.label}>Kadar Faedah Tahunan (%)</label>
                <input
                    type="number"
                    step="0.01"
                    id="interestRate"
                    placeholder="Contoh: 3.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || '')}
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = styles.inputFocus.borderColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = styles.input.border.split(' ')[2]}
                />

                <hr style={{ border: '1px solid #eee', margin: '30px 0' }} />

                {/* Input DSR */}
                <label htmlFor="netIncome" style={styles.label}>Gaji Bersih Bulanan (RM) - Selepas Potongan</label>
                <input
                    type="number"
                    id="netIncome"
                    placeholder="Contoh: 5000"
                    value={netIncome}
                    onChange={(e) => setNetIncome(parseFloat(e.target.value) || '')}
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = styles.inputFocus.borderColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = styles.input.border.split(' ')[2]}
                />

                <label htmlFor="existingDebt" style={styles.label}>Komitmen Hutang Sedia Ada Bulanan (RM)</label>
                <input
                    type="number"
                    id="existingDebt"
                    placeholder="Contoh: 1500"
                    value={existingDebt}
                    onChange={(e) => setExistingDebt(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = styles.inputFocus.borderColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = styles.input.border.split(' ')[2]}
                />

                {/* Pesanan jika belum siap kira */}
                {!isReadyToCalculate && (
                    <div style={{ ...styles.resultSection, background: '#fcf8e3', border: '1px solid #faebcc', color: '#8a6d3b', textAlign: 'center' }}>
                        Sila lengkapkan semua medan pinjaman dan pendapatan untuk melihat keputusan.
                    </div>
                )}


                {/* Paparkan hasil secara live apabila sedia */}
                {isReadyToCalculate && calculation.dsrValue !== null && (
                    <div style={styles.resultSection}>
                        <h3>📊 Keputusan Kiraan:</h3>

                        <div style={styles.resultItem}>
                            <span>Ansuran Kereta Bulanan:</span>
                            <span style={styles.dsrValue}>
                                RM {calculation.monthlyPayment ? calculation.monthlyPayment.toFixed(2) : 'N/A'}
                            </span>
                        </div>

                        <div style={{ ...styles.resultItem, border: 'none', paddingTop: '15px' }}>
                            <span>Nisbah Khidmat Hutang (DSR):</span>
                            <span style={styles.dsrValue}>
                                {calculation.dsrValue}%
                            </span>
                        </div>

                        <div style={styles.resultItem}>
                            <span style={{ fontWeight: 'bold' }}>Peluang Kelulusan Bank:</span>
                            <span
                                style={{
                                    ...styles.dsrValue,
                                    color: StatusColors[calculation.statusClass],
                                    fontSize: '18px'
                                }}
                            >
                                {calculation.statusText}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <footer style={footerStyles}>
                <p style={{ margin: '0' }}>© 2025 Zaid Murat | Proton Sales Consultant</p>
                <p style={{ fontSize: '12px', color: '#ccc', margin: '5px 0 0' }}>Garis panduan DSR adalah anggaran, tertakluk kepada budi bicara bank.</p>
            </footer>

            {/* CSS untuk Animasi dan Media Query (Jika diperlukan) */}
            <style>{`
        @keyframes fadeIn {
            from {opacity: 0; transform: translateY(10px);}
            to {opacity: 1; transform: translateY(0);}
        }
        [style*="animation: fadeIn"] {
            animation: fadeIn 0.5s ease-in-out;
        }
        
        /* Font Import */
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
      `}</style>
        </div>
    );
};