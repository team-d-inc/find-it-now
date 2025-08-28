import { PrismaClient, ProfileStatus } from '@/generated/prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { sendInvitationEmail } from '@/lib/email/institution';
import jwt from 'jsonwebtoken';
import { getUserProfile } from '@/services/profileService';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const prismaClient = new PrismaClient();
    const userProfile = await getUserProfile();
    if (!userProfile?.organization) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organization not found.',
        },
        {
          status: 404,
        },
      );
    }

    try {
      const { email } = await req.json();
      if (!email) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email is required',
          },
          {
            status: 400,
          },
        );
      }

      // Check if the email already exists
      const profile = await prismaClient.profile.findUnique({
        where: { email },
      });

      
      if (!profile) {
        return NextResponse.json(
          {
            success: false,
            error: `No account found for ${email}.`,
          },
          {
            status: 404,
          },
        );
      }

      if (profile?.status !== ProfileStatus.INACTIVE) {
        return NextResponse.json(
          {
            success: false,
            error: `An invitation has already been sent to ${email}.`,
          },
          {
            status: 200,
          },
        );
      }

      // Do NOT create Supabase user here to avoid automatic emails
      // Supabase user will be created only when the user sets their password

      const generatedToken = jwt.sign({ email }, process.env.JWT_SECRET || 'default_secret_key', {
        expiresIn: '5d',
      });

      // Send Reset Password Email
      const inviteSentRes = await sendInvitationEmail({
        email,
        inviteLink: `http://localhost:3000/set-password?email=${encodeURIComponent(email)}&token=${generatedToken}`,
        organizationName: userProfile.organization.name,
      });
      console.log('Invite sent result:', inviteSentRes);

      if (!inviteSentRes?.id) {
        console.error('Error sending invitation:', inviteSentRes);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to send invitation to ${email}.`,
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Invitation sent successfully',
          email,
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Internal Server Error',
        },
        {
          status: 500,
        },
      );
    }
  } else {
    return NextResponse.json(
      {
        error: 'Method Not Allowed',
      },
      {
        status: 405,
      },
    );
  }
}
