import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[StudentOS ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 font-sans text-right" dir="rtl">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-white">
                حدث خطأ غير متوقع أثناء تحميل الصفحة
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                بياناتك وتقدمك الدراسي في أمان كامل. تحقق من اتصالك أو أعد تحميل الصفحة للاستمرار.
              </p>
            </div>

            <div className="pt-3 flex justify-center gap-3">
              <Button
                variant="primary"
                onClick={this.handleReset}
                icon={RotateCcw}
              >
                إعادة المحاولة
              </Button>

              <Button
                variant="secondary"
                onClick={this.handleGoHome}
                icon={Home}
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
