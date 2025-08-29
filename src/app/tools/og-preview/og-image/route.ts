import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import React from 'react';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract parameters with defaults
        const title = searchParams.get('title') || 'Untitled';
        const description = searchParams.get('description') || '';
        const siteName = searchParams.get('siteName') || 'Kevin Hou';
        const url = searchParams.get('url') || '';
        const template = searchParams.get('template') || 'default';

        // Generate the image based on template
        return new ImageResponse(
            React.createElement(
                'div',
                {
                    style: {
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                        backgroundImage: 'linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 100%)',
                        padding: '80px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                    }
                },
                // Main content container
                React.createElement(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '60px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            border: '1px solid #e5e7eb',
                            maxWidth: '1000px',
                            width: '100%',
                        }
                    },
                    // Title
                    React.createElement(
                        'div',
                        {
                            style: {
                                fontSize: title.length > 50 ? '48px' : '64px',
                                fontWeight: 'bold',
                                color: '#111827',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                marginBottom: '24px',
                                maxWidth: '800px',
                            }
                        },
                        title
                    ),
                    // Description
                    description ? React.createElement(
                        'div',
                        {
                            style: {
                                fontSize: '24px',
                                color: '#6b7280',
                                textAlign: 'center',
                                lineHeight: 1.4,
                                marginBottom: '32px',
                                maxWidth: '700px',
                            }
                        },
                        description.length > 120 ? description.substring(0, 120) + '...' : description
                    ) : null,
                    // Bottom section with site name and URL
                    React.createElement(
                        'div',
                        {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                borderTop: '2px solid #f3f4f6',
                                paddingTop: '24px',
                                marginTop: 'auto',
                            }
                        },
                        React.createElement(
                            'div',
                            {
                                style: {
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#374151',
                                }
                            },
                            siteName
                        ),
                        url ? React.createElement(
                            'div',
                            {
                                style: {
                                    fontSize: '18px',
                                    color: '#9ca3af',
                                }
                            },
                            url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                        ) : null
                    )
                ),
                // Decorative elements
                React.createElement('div', {
                    style: {
                        position: 'absolute',
                        top: '40px',
                        right: '40px',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        opacity: 0.1,
                    }
                }),
                React.createElement('div', {
                    style: {
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        opacity: 0.1,
                    }
                })
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.error('Error generating OG image:', e);
        return new Response(`Failed to generate the image: ${e.message}`, {
            status: 500,
        });
    }
}
