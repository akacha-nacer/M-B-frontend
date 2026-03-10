import { useEffect, useState } from 'react';

// ==============================|| COMPONENT - PRESCRIPTION STEPPER ||============================== //

const COLORS = {
    complete: '#0d6efd',
    current:  '#0d6efd',
    upcoming: '#dee2e6',
    expired:  '#ffc107',
    cancelled:'#dc3545',
};

export default function PrescriptionStepper({ currentMonth, durationInMonths, status, expired }) {
    const [animatedDots, setAnimatedDots] = useState([]);
    const [animatedLines, setAnimatedLines] = useState([]);

    useEffect(() => {
        // Animate dots successively: dot 1 → dot 2 → dot 3
        const dotTimers = [];
        Array.from({ length: durationInMonths }, (_, i) => i + 1).forEach((month, index) => {
            const t = setTimeout(() => {
                setAnimatedDots(prev => [...prev, month]);
            }, 100 + index * 250); // each dot appears 250ms after the previous
            dotTimers.push(t);
        });

        // Animate lines successively: line 1→2 appears after dot 1, line 2→3 after dot 2
        const lineTimers = [];
        Array.from({ length: durationInMonths - 1 }, (_, i) => i).forEach((index) => {
            const t = setTimeout(() => {
                setAnimatedLines(prev => [...prev, index]);
            }, 200 + index * 250); // line fills just after its source dot appears
            lineTimers.push(t);
        });

        return () => {
            dotTimers.forEach(clearTimeout);
            lineTimers.forEach(clearTimeout);
        };
    }, [durationInMonths]);

    const steps = Array.from({ length: durationInMonths }, (_, i) => i + 1);

    const getStepState = (month) => {
        if (status === 'CANCELLED') return 'cancelled';
        if (status === 'COMPLETED') return 'complete';
        if (month < currentMonth) return 'complete';
        if (month === currentMonth) return expired ? 'expired' : 'current';
        return 'upcoming';
    };

    const getStepColor = (state) => {
        if (state === 'complete')   return COLORS.complete;
        if (state === 'current')    return COLORS.current;
        if (state === 'expired')    return COLORS.expired;
        if (state === 'cancelled')  return COLORS.cancelled;
        return COLORS.upcoming;
    };

    const getLineColor = (month) => {
        if (status === 'CANCELLED') return COLORS.cancelled;
        if (status === 'COMPLETED') return COLORS.complete;
        if (month < currentMonth)   return COLORS.complete;
        return COLORS.upcoming;
    };

    return (
        <div style={styles.wrapper}>
            {steps.map((month, index) => {
                const state = getStepState(month);
                const color = getStepColor(state);
                const isLast = index === steps.length - 1;
                const dotVisible = animatedDots.includes(month);
                const lineVisible = animatedLines.includes(index);

                return (
                    <div key={month} style={styles.stepWrapper}>

                        {/* Step dot + label */}
                        <div style={styles.stepColumn}>
                            <div
                                style={{
                                    ...styles.dot,
                                    backgroundColor: state === 'upcoming' ? '#fff' : color,
                                    borderColor: color,
                                    boxShadow: (state === 'current' || state === 'expired')
                                        ? `0 0 0 5px ${color}28`
                                        : 'none',
                                    transform: dotVisible ? 'scale(1)' : 'scale(0)',
                                    opacity: dotVisible ? 1 : 0,
                                    transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
                                }}
                            >
                                {state === 'complete' && (
                                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none"
                                         style={{ opacity: dotVisible ? 1 : 0, transition: 'opacity 0.2s ease 0.15s' }}>
                                        <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.8"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                                {(state === 'current' || state === 'expired') && (
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
                    {month}
                  </span>
                                )}
                                {state === 'upcoming' && (
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: COLORS.upcoming }} />
                                )}
                                {state === 'cancelled' && (
                                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 2L8 8M8 2L2 8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                                    </svg>
                                )}
                            </div>

                            {/* Label */}
                            <span style={{
                                ...styles.label,
                                color: state === 'upcoming' ? '#adb5bd' : color,
                                fontWeight: state === 'current' || state === 'expired' ? 700 : 400,
                                opacity: dotVisible ? 1 : 0,
                                transform: dotVisible ? 'translateY(0)' : 'translateY(5px)',
                                transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
                            }}>
                Mois {month}
              </span>
                        </div>

                        {/* Connecting line */}
                        {!isLast && (
                            <div style={styles.lineWrapper}>
                                <div style={{ ...styles.line, backgroundColor: COLORS.upcoming }} />
                                <div style={{
                                    ...styles.line,
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    backgroundColor: getLineColor(month),
                                    width: lineVisible && getLineColor(month) !== COLORS.upcoming ? '100%' : '0%',
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        padding: '4px 0',
    },
    stepWrapper: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
    },
    stepColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '7px',
        position: 'relative',
        zIndex: 1,
    },
    dot: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '2.5px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
    },
    label: {
        fontSize: '0.72rem',
        whiteSpace: 'nowrap',
        letterSpacing: '0.2px',
    },
    lineWrapper: {
        flex: 1,
        height: 3,
        position: 'relative',
        marginBottom: 26,
        marginLeft: -1,
        marginRight: -1,
    },
    line: {
        width: '100%',
        height: '100%',
        borderRadius: 2,
    },
};