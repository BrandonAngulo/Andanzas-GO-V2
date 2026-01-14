
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { supportService } from '../../services/support.service';
import { Phone, Mail, MessageCircle, CheckCircle2, User, HelpCircle, Send, Loader2 } from 'lucide-react';

const SoportePanel: React.FC = () => {
    const { t } = useI18n();
    const { user } = useAuth();

    // State for Call Me Back Form
    const [callbackName, setCallbackName] = useState('');
    const [callbackPhone, setCallbackPhone] = useState('');
    const [callbackReason, setCallbackReason] = useState('');
    const [callbackSuccess, setCallbackSuccess] = useState(false);
    const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);

    // State for Contact Form
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactSuccess, setContactSuccess] = useState(false);
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);

    // Autofill user data if available
    useEffect(() => {
        if (user) {
            const name = user.user_metadata?.full_name || '';
            if (name) setCallbackName(name);
            if (user.email) setContactEmail(user.email);
        }
    }, [user]);

    const handleCallbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingCallback(true);
        try {
            await supportService.submitTicket(
                user?.id || 'anonymous',
                'callback',
                `Phone: ${callbackPhone}\nName: ${callbackName}\nReason: ${callbackReason}`
            );
            setCallbackSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Error enviando solicitud. Intente nuevamente.");
        } finally {
            setIsSubmittingCallback(false);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingContact(true);
        try {
            await supportService.submitTicket(
                user?.id || 'anonymous',
                'contact',
                `Email: ${contactEmail}\nMessage: ${contactMessage}`
            );
            setContactSuccess(true);
            setContactMessage('');
        } catch (error) {
            console.error(error);
            alert("Error enviando mensaje. Intente nuevamente.");
        } finally {
            setIsSubmittingContact(false);
        }
    };

    const faqs = [
        { question: t('support.faq1_q'), answer: t('support.faq1_a') },
        { question: t('support.faq2_q'), answer: t('support.faq2_a') },
        { question: t('support.faq3_q'), answer: t('support.faq3_a') },
        { question: t('support.faq4_q'), answer: t('support.faq4_a') }
    ];

    return (
        <ScrollArea className="h-[72vh]">
            <div className="p-3">
                <Tabs defaultValue="faq" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="faq" className="gap-2"><HelpCircle className="h-4 w-4" /> {t('support.helpCenter')}</TabsTrigger>
                        <TabsTrigger value="contact" className="gap-2"><MessageCircle className="h-4 w-4" /> {t('support.contactSupport')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="faq">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('support.faq')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion defaultValue="item-0">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact">
                        <div className="grid gap-4">
                            {/* Call Me Back Section */}
                            <Card className="border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" /> {t('support.callMeBackTitle')}
                                    </CardTitle>
                                    <CardDescription>{t('support.callMeBackDesc')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {callbackSuccess ? (
                                        <div className="flex flex-col items-center justify-center p-4 text-center bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                                            <CheckCircle2 className="h-10 w-10 text-green-600 mb-2" />
                                            <p className="font-medium text-green-800 dark:text-green-300">{t('support.successCallback')}</p>
                                            <Button variant="ghost" size="sm" onClick={() => setCallbackSuccess(false)} className="mt-2 text-green-700">Nueva solicitud</Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleCallbackSubmit} className="grid gap-3">
                                            <div className="grid gap-1">
                                                <label htmlFor="cb-name" className="text-xs font-medium">{t('support.nameLabel')}</label>
                                                <Input id="cb-name" placeholder="Tu nombre" value={callbackName} onChange={(e) => setCallbackName(e.target.value)} required />
                                            </div>
                                            <div className="grid gap-1">
                                                <label htmlFor="cb-phone" className="text-xs font-medium">{t('support.phoneLabel')}</label>
                                                <Input id="cb-phone" type="tel" placeholder="Ej. 300 123 4567" value={callbackPhone} onChange={(e) => setCallbackPhone(e.target.value)} required />
                                            </div>
                                            <div className="grid gap-1">
                                                <label htmlFor="cb-reason" className="text-xs font-medium">{t('support.reasonLabel')}</label>
                                                <Input id="cb-reason" placeholder="Motivo breve (opcional)" value={callbackReason} onChange={(e) => setCallbackReason(e.target.value)} />
                                            </div>
                                            <Button type="submit" className="w-full mt-1" disabled={isSubmittingCallback}>
                                                {isSubmittingCallback && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {t('support.requestCallback')}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Email Form Section */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary" /> {t('support.writeUsTitle')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {contactSuccess ? (
                                        <div className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                                            <Send className="h-10 w-10 text-blue-600 mb-2" />
                                            <p className="font-medium text-blue-800 dark:text-blue-300">{t('support.successMessage')}</p>
                                            <Button variant="ghost" size="sm" onClick={() => setContactSuccess(false)} className="mt-2 text-blue-700">Enviar otro mensaje</Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleContactSubmit} className="grid gap-3">
                                            <div className="grid gap-1">
                                                <label htmlFor="ct-email" className="text-xs font-medium">{t('support.emailLabel')}</label>
                                                <Input id="ct-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
                                            </div>
                                            <div className="grid gap-1">
                                                <label htmlFor="ct-msg" className="text-xs font-medium">{t('support.messageLabel')}</label>
                                                <Textarea id="ct-msg" placeholder={t('support.contactPlaceholder')} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required className="min-h-[100px]" />
                                            </div>
                                            <Button type="submit" variant="secondary" className="w-full mt-1" disabled={isSubmittingContact}>
                                                {isSubmittingContact && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {t('support.send')}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Live Chat Button */}
                            <Button variant="outline" className="w-full py-6 flex flex-col gap-1 h-auto">
                                <MessageCircle className="h-6 w-6" />
                                <span>{t('support.chat')}</span>
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    );
};

export default SoportePanel;